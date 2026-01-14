import React, { useRef, useCallback, useState } from 'react';
import { useMeeting } from '@/contexts/MeetingContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Upload,
    FileText,
    Image,
    File,
    Video,
    Music,
    Download,
    X,
    CloudUpload
} from 'lucide-react';
import { cn } from '@/lib/utils';

function getFileIcon(type) {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    if (type.startsWith('audio/')) return Music;
    if (type.includes('pdf') || type.includes('document')) return FileText;
    return File;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function FileSharing() {
    const { sharedFiles, addSharedFile, userName } = useMeeting();
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);

    const handleFileSelect = useCallback((files) => {
        Array.from(files).forEach(file => {
            addSharedFile(file);
        });
    }, [addSharedFile]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    }, [handleFileSelect]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDownload = useCallback((file) => {
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name;
        link.click();
    }, []);

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-700/50">
                <h2 className="text-lg font-semibold text-white">Shared Files</h2>
                <p className="text-sm text-gray-400 mt-1">
                    {sharedFiles.length} file{sharedFiles.length !== 1 ? 's' : ''} shared
                </p>
            </div>

            {/* Upload area */}
            <div className="p-4">
                <div
                    className={cn(
                        "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
                        isDragging
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-gray-600 hover:border-gray-500"
                    )}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileSelect(e.target.files)}
                    />

                    <CloudUpload className={cn(
                        "w-12 h-12 mx-auto mb-4 transition-colors",
                        isDragging ? "text-blue-400" : "text-gray-400"
                    )} />

                    <p className="text-gray-300 mb-2">
                        Drag and drop files here, or
                    </p>

                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        Choose Files
                    </Button>
                </div>
            </div>

            {/* File list */}
            <ScrollArea className="flex-1 px-4">
                <div className="space-y-3 pb-4">
                    {sharedFiles.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <File className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No files shared yet</p>
                        </div>
                    ) : (
                        sharedFiles.map((file) => {
                            const FileIcon = getFileIcon(file.type);
                            const isImage = file.type.startsWith('image/');

                            return (
                                <div
                                    key={file.id}
                                    className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-gray-600 transition-colors"
                                >
                                    <div className="flex items-start gap-3">
                                        {isImage ? (
                                            <div
                                                className="w-12 h-12 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0 cursor-pointer"
                                                onClick={() => setPreviewFile(file)}
                                            >
                                                <img
                                                    src={file.url}
                                                    alt={file.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                                                <FileIcon className="w-6 h-6 text-blue-400" />
                                            </div>
                                        )}

                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium truncate">{file.name}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {formatFileSize(file.size)} • Shared by {file.sharedBy}
                                            </p>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="flex-shrink-0"
                                            onClick={() => handleDownload(file)}
                                        >
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </ScrollArea>

            {/* Image preview modal */}
            {previewFile && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8"
                    onClick={() => setPreviewFile(null)}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4"
                        onClick={() => setPreviewFile(null)}
                    >
                        <X className="w-6 h-6" />
                    </Button>
                    <img
                        src={previewFile.url}
                        alt={previewFile.name}
                        className="max-w-full max-h-full object-contain rounded-lg"
                    />
                </div>
            )}
        </div>
    );
}
