export const mockItems = [
  {
    id: 1,
    title: 'Professional DSLR Camera',
    description: 'Canon EOS 5D Mark IV with 24-70mm lens. Perfect for events and photography projects.',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400',
    category: 'Electronics',
    type: 'rental',
    price: 50,
    owner: 'John Doe',
    rating: 4.8,
    reviews: [
      { user: 'Alice', rating: 5, comment: 'Great camera, owner was very helpful!' },
      { user: 'Bob', rating: 4, comment: 'Good condition, would rent again.' }
    ]
  },
  {
    id: 2,
    title: 'Power Drill Set',
    description: 'Complete drill set with various bits. Great for home improvement projects.',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400',
    category: 'Tools',
    type: 'barter',
    owner: 'Jane Smith',
    rating: 4.5,
    reviews: [
      { user: 'Charlie', rating: 5, comment: 'Perfect for my weekend project!' }
    ]
  },
  {
    id: 3,
    title: 'Wedding Dress',
    description: 'Beautiful white wedding dress, size 8. Only worn once.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
    category: 'Clothing',
    type: 'rental',
    price: 100,
    owner: 'Emily Brown',
    rating: 5.0,
    reviews: [
      { user: 'Diana', rating: 5, comment: 'Stunning dress, made my day special!' }
    ]
  }
];
