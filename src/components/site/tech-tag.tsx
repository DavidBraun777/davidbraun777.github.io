import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface TechTagProps {
  children: string
  className?: string
}

export function TechTag({ children, className }: Readonly<TechTagProps>) {
  return (
    <Badge
      variant="outline"
      className={cn('bg-background-subtle text-xs font-medium sm:text-sm', className)}
    >
      {children}
    </Badge>
  )
}
