import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  as?: 'h1' | 'h2'
  className?: string
}

export function SectionHeader({
  title,
  subtitle,
  align = 'center',
  as: Heading = 'h2',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-8 md:mb-10', align === 'center' && 'text-center', className)}>
      <Heading className="text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
        {title}
      </Heading>
      <div
        className={cn(
          'bg-theme-gradient-primary mt-4 h-1 w-[4.5rem] rounded-full opacity-80',
          align === 'center' && 'mx-auto'
        )}
      />
      {subtitle ? (
        <p
          className={cn(
            'mt-4 max-w-2xl text-base leading-7 text-text-secondary md:text-lg',
            align === 'center' && 'mx-auto'
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
