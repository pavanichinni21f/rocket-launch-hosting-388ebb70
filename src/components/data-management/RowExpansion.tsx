import React from 'react';
import { DataItem } from '../../types/data';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { format } from 'date-fns';

interface RowExpansionProps {
  item: DataItem;
}

export const RowExpansion: React.FC<RowExpansionProps> = ({ item }) => {
  return (
    <div className="p-4 bg-muted/50 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {Object.entries(item.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="font-medium">{key}:</span>
                  <span className="text-muted-foreground">{String(value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="text-sm">
          <span className="font-medium">Created:</span>{' '}
          <span className="text-muted-foreground">
            {format(item.createdAt, 'PPP p')}
          </span>
        </div>
        <div className="text-sm">
          <span className="font-medium">Last Updated:</span>{' '}
          <span className="text-muted-foreground">
            {format(item.updatedAt, 'PPP p')}
          </span>
        </div>
      </div>
    </div>
  );
};