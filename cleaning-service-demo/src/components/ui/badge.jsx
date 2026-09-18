import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import React from 'react';

const badgeVariants = cva(
	'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
	{
		variants: {
			variant: {
				default: 'border-transparent bg-primary text-primary-foreground',
				secondary: 'border-transparent bg-secondary text-secondary-foreground',
				outline: 'border-border bg-transparent text-foreground',
				success: 'border-transparent bg-success-bg text-success',
				warning: 'border-transparent bg-warning-bg text-warning',
				destructive: 'border-transparent bg-destructive-bg text-destructive',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);

function Badge({ className, variant, ...props }) {
	return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
