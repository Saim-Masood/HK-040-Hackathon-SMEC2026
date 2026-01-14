import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useMeeting } from '@/contexts/MeetingContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import {
    Pencil,
    Eraser,
    Square,
    Circle,
    Minus,
    Trash2,
    Undo2,
    Redo2,
    Download,
    Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';

const COLORS = [
    '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ff8800',
    '#8800ff', '#00ff88', '#ff0088', '#88ff00'
];

const BRUSH_SIZES = [2, 4, 8, 12, 20];

export function Whiteboard() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const { updateWhiteboard, whiteboardData, clearWhiteboard } = useMeeting();

    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState('pen'); // 'pen', 'eraser', 'rectangle', 'circle', 'line'
    const [color, setColor] = useState('#ffffff');
    const [brushSize, setBrushSize] = useState(4);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showBrushSize, setShowBrushSize] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [tempCanvas, setTempCanvas] = useState(null);

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (canvas && container) {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;

            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Save initial state
            saveToHistory();
        }
    }, []);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (canvas && container) {
                const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight;
                canvas.getContext('2d').putImageData(imageData, 0, 0);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const saveToHistory = useCallback(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const imageData = canvas.toDataURL();
            setHistory(prev => [...prev.slice(0, historyIndex + 1), imageData]);
            setHistoryIndex(prev => prev + 1);
        }
    }, [historyIndex]);

    const getPos = useCallback((e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }, []);

    const startDrawing = useCallback((e) => {
        e.preventDefault();
        const pos = getPos(e);
        setIsDrawing(true);
        setStartPos(pos);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (tool === 'pen' || tool === 'eraser') {
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        } else {
            // Save current canvas for shape drawing
            setTempCanvas(canvas.toDataURL());
        }
    }, [tool, getPos]);

    const draw = useCallback((e) => {
        if (!isDrawing) return;
        e.preventDefault();

        const pos = getPos(e);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (tool === 'pen') {
            ctx.strokeStyle = color;
            ctx.lineWidth = brushSize;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        } else if (tool === 'eraser') {
            ctx.strokeStyle = '#1a1a2e';
            ctx.lineWidth = brushSize * 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        } else if (tempCanvas) {
            // Redraw from temp canvas for shapes
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);

                ctx.strokeStyle = color;
                ctx.lineWidth = brushSize;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                if (tool === 'rectangle') {
                    ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
                } else if (tool === 'circle') {
                    const radius = Math.sqrt(
                        Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2)
                    );
                    ctx.beginPath();
                    ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
                    ctx.stroke();
                } else if (tool === 'line') {
                    ctx.beginPath();
                    ctx.moveTo(startPos.x, startPos.y);
                    ctx.lineTo(pos.x, pos.y);
                    ctx.stroke();
                }
            };
            img.src = tempCanvas;
        }
    }, [isDrawing, tool, color, brushSize, getPos, startPos, tempCanvas]);

    const stopDrawing = useCallback(() => {
        if (isDrawing) {
            setIsDrawing(false);
            setTempCanvas(null);
            saveToHistory();
        }
    }, [isDrawing, saveToHistory]);

    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
            img.src = history[historyIndex - 1];
            setHistoryIndex(prev => prev - 1);
        }
    }, [history, historyIndex]);

    const handleRedo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
            img.src = history[historyIndex + 1];
            setHistoryIndex(prev => prev + 1);
        }
    }, [history, historyIndex]);

    const handleClear = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveToHistory();
        clearWhiteboard();
    }, [clearWhiteboard, saveToHistory]);

    const handleDownload = useCallback(() => {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = 'whiteboard.png';
        link.href = canvas.toDataURL();
        link.click();
    }, []);

    const tools = [
        { id: 'pen', icon: Pencil, label: 'Pen' },
        { id: 'eraser', icon: Eraser, label: 'Eraser' },
        { id: 'line', icon: Minus, label: 'Line' },
        { id: 'rectangle', icon: Square, label: 'Rectangle' },
        { id: 'circle', icon: Circle, label: 'Circle' },
    ];

    return (
        <TooltipProvider>
            <div className="h-full flex flex-col">
                {/* Toolbar */}
                <div className="flex items-center gap-2 p-3 bg-gray-800/80 backdrop-blur border-b border-gray-700/50">
                    {/* Drawing tools */}
                    <div className="flex items-center gap-1 bg-gray-700/50 rounded-lg p-1">
                        {tools.map((t) => (
                            <Tooltip key={t.id}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={tool === t.id ? "default" : "ghost"}
                                        size="icon"
                                        className="w-9 h-9"
                                        onClick={() => setTool(t.id)}
                                    >
                                        <t.icon className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{t.label}</TooltipContent>
                            </Tooltip>
                        ))}
                    </div>

                    <div className="w-px h-8 bg-gray-600" />

                    {/* Color picker */}
                    <div className="relative">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-9 h-9"
                                    onClick={() => setShowColorPicker(!showColorPicker)}
                                >
                                    <div
                                        className="w-5 h-5 rounded-full border-2 border-white"
                                        style={{ backgroundColor: color }}
                                    />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Color</TooltipContent>
                        </Tooltip>

                        {showColorPicker && (
                            <div className="absolute top-full left-0 mt-2 p-2 bg-gray-800 rounded-lg border border-gray-700 shadow-xl z-50">
                                <div className="grid grid-cols-4 gap-1">
                                    {COLORS.map((c) => (
                                        <button
                                            key={c}
                                            className={cn(
                                                "w-7 h-7 rounded-full border-2 transition-transform hover:scale-110",
                                                color === c ? "border-white" : "border-transparent"
                                            )}
                                            style={{ backgroundColor: c }}
                                            onClick={() => {
                                                setColor(c);
                                                setShowColorPicker(false);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Brush size */}
                    <div className="relative">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => setShowBrushSize(!showBrushSize)}
                                >
                                    <div
                                        className="rounded-full bg-white"
                                        style={{ width: brushSize + 4, height: brushSize + 4 }}
                                    />
                                    <span className="text-xs">{brushSize}px</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Brush Size</TooltipContent>
                        </Tooltip>

                        {showBrushSize && (
                            <div className="absolute top-full left-0 mt-2 p-2 bg-gray-800 rounded-lg border border-gray-700 shadow-xl z-50">
                                <div className="flex gap-2">
                                    {BRUSH_SIZES.map((size) => (
                                        <button
                                            key={size}
                                            className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                                brushSize === size ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                                            )}
                                            onClick={() => {
                                                setBrushSize(size);
                                                setShowBrushSize(false);
                                            }}
                                        >
                                            <div
                                                className="rounded-full bg-white"
                                                style={{ width: size + 2, height: size + 2 }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-px h-8 bg-gray-600" />

                    {/* Actions */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="w-9 h-9"
                                onClick={handleUndo}
                                disabled={historyIndex <= 0}
                            >
                                <Undo2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Undo</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="w-9 h-9"
                                onClick={handleRedo}
                                disabled={historyIndex >= history.length - 1}
                            >
                                <Redo2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Redo</TooltipContent>
                    </Tooltip>

                    <div className="flex-1" />

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="w-9 h-9"
                                onClick={handleDownload}
                            >
                                <Download className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Download</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="destructive"
                                size="icon"
                                className="w-9 h-9"
                                onClick={handleClear}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Clear</TooltipContent>
                    </Tooltip>
                </div>

                {/* Canvas */}
                <div ref={containerRef} className="flex-1 overflow-hidden">
                    <canvas
                        ref={canvasRef}
                        className={cn(
                            "whiteboard-canvas w-full h-full",
                            tool === 'eraser' && 'eraser'
                        )}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />
                </div>
            </div>
        </TooltipProvider>
    );
}
