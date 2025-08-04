import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  variants: Array<{
    id: string;
    title: string;
    price: string;
  }>;
}

interface ShopifyProductGridProps {
  onAddToCart?: (productId: string, variantId: string) => void;
}

export function ShopifyProductGrid({ onAddToCart }: ShopifyProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Array<{ productId: string; variantId: string; quantity: number }>>([]);
  const { toast } = useToast();

  // Mock Shopify products for demo
  const mockProducts: Product[] = [
    {
      id: 'light-1',
      title: 'Modern Pendant Light',
      description: 'Sleek pendant light perfect for dining areas',
      price: '$149.99',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+💡</dGV4dD48L3N2Zz4=',
      variants: [
        { id: 'var-1', title: 'Black', price: '$149.99' },
        { id: 'var-2', title: 'White', price: '$149.99' },
        { id: 'var-3', title: 'Brass', price: '$169.99' }
      ]
    },
    {
      id: 'light-2',
      title: 'Crystal Chandelier',
      description: 'Elegant crystal chandelier for luxury spaces',
      price: '$599.99',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+✨</text></svg>',
      variants: [
        { id: 'var-4', title: 'Small', price: '$599.99' },
        { id: 'var-5', title: 'Large', price: '$799.99' }
      ]
    },
    {
      id: 'light-3',
      title: 'LED Strip Lights',
      description: 'Smart RGB LED strips with app control',
      price: '$79.99',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+🌈</text></svg>',
      variants: [
        { id: 'var-6', title: '5m', price: '$79.99' },
        { id: 'var-7', title: '10m', price: '$129.99' }
      ]
    },
    {
      id: 'light-4',
      title: 'Industrial Floor Lamp',
      description: 'Vintage industrial style floor lamp',
      price: '$229.99',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+🏭</text></svg>',
      variants: [
        { id: 'var-8', title: 'Black Iron', price: '$229.99' },
        { id: 'var-9', title: 'Copper', price: '$249.99' }
      ]
    }
  ];

  useEffect(() => {
    // Simulate Shopify API call
    const fetchProducts = async () => {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProducts(mockProducts);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (productId: string, variantId: string) => {
    const existingItem = cart.find(item => item.productId === productId && item.variantId === variantId);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { productId, variantId, quantity: 1 }]);
    }

    const product = products.find(p => p.id === productId);
    const variant = product?.variants.find(v => v.id === variantId);
    
    toast({
      title: "Added to Cart",
      description: `${product?.title} (${variant?.title}) added to cart`,
    });

    onAddToCart?.(productId, variantId);
  };

  if (loading) {
    return (
      <Card className="bg-galaxy-card border-galaxy-purple/30">
        <CardContent className="p-8 text-center">
          <div className="text-galaxy-bright">Loading products from Shopify...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-galaxy-card border-galaxy-purple/30">
        <CardHeader>
          <CardTitle className="text-galaxy-bright flex items-center justify-between">
            <span className="flex items-center">
              <span className="mr-2">🛒</span>
              Lighting Store
            </span>
            <Badge variant="outline" className="text-galaxy-accent border-galaxy-purple/30">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} items
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="bg-galaxy-secondary border-galaxy-purple/20">
                <CardContent className="p-4 space-y-3">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-32 object-cover rounded-md bg-galaxy-accent/10"
                  />
                  <div>
                    <h3 className="font-semibold text-galaxy-bright text-sm">{product.title}</h3>
                    <p className="text-xs text-galaxy-accent mt-1">{product.description}</p>
                    <div className="text-galaxy-bright font-bold mt-2">{product.price}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <select className="w-full bg-galaxy-button border border-galaxy-purple/30 rounded text-galaxy-bright text-xs p-2">
                      {product.variants.map((variant) => (
                        <option key={variant.id} value={variant.id}>
                          {variant.title} - {variant.price}
                        </option>
                      ))}
                    </select>
                    
                    <Button 
                      size="sm"
                      className="w-full bg-blue-gradient hover:opacity-90 text-white"
                      onClick={() => handleAddToCart(product.id, product.variants[0].id)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}