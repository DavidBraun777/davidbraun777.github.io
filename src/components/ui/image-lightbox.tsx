'use client'

import * as Dialog from '@radix-ui/react-dialog'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Expand, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageLightboxProps {
  src: string
  alt: string
  title: string
  description?: string
  visualAspect: 'landscape' | 'portrait'
  visualSurface: 'dark' | 'light'
  sizes: string
  thumb: React.ReactNode
}

const desktopZoomSteps = [
  { scale: 1, label: 'Expanded view' },
  { scale: 1.85, label: 'Detail zoom' },
  { scale: 1.2, label: 'Balanced zoom' },
]

const mobileZoomSteps = [
  { scale: 1, label: 'Expanded view' },
  { scale: 4.5, label: 'Detail zoom' },
  { scale: 3.15, label: 'Balanced zoom' },
]

export function ImageLightbox({
  src,
  alt,
  title,
  description,
  visualAspect,
  visualSurface,
  sizes,
  thumb,
}: ImageLightboxProps) {
  const [open, setOpen] = useState(false)
  const [zoomIndex, setZoomIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const zoomSteps = isMobile ? mobileZoomSteps : desktopZoomSteps
  const zoomStep = zoomSteps[zoomIndex]

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)')
    const updateViewportMode = () => setIsMobile(mediaQuery.matches)

    updateViewportMode()
    mediaQuery.addEventListener('change', updateViewportMode)

    return () => mediaQuery.removeEventListener('change', updateViewportMode)
  }, [])

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setZoomIndex(0)
    }
  }

  const cycleZoom = () => {
    setZoomIndex((current) => (current + 1) % zoomSteps.length)
  }

  const imageFrameStyle =
    visualAspect === 'portrait'
      ? {
          width:
            zoomStep.scale === 1
              ? 'min(100%, 640px)'
              : `${Math.round((isMobile ? 520 : 640) * zoomStep.scale)}px`,
        }
      : { width: `${Math.round(zoomStep.scale * 100)}%` }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="group relative block w-full text-left"
          aria-label={`Expand image for ${title}`}
        >
          {thumb}
          <span className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/80 px-3 py-1.5 text-xs font-medium text-slate-100 opacity-0 shadow-lg shadow-slate-950/30 transition-opacity group-hover:opacity-100">
            <Expand className="h-3.5 w-3.5" />
            Expand
          </span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-slate-950/88 backdrop-blur-md" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] w-[min(98vw,1120px)] -translate-x-1/2 -translate-y-1/2 rounded-[1.5rem] border border-white/10 bg-slate-950/96 p-2 text-slate-100 shadow-[0_40px_120px_-40px_rgba(2,6,23,0.95)] sm:w-[min(96vw,1120px)] sm:rounded-[2rem] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="pr-6">
              <Dialog.Title className="text-xl font-semibold text-white sm:text-2xl">
                {title}
              </Dialog.Title>
              {description ? (
                <Dialog.Description className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
                  {description}
                </Dialog.Description>
              ) : null}
            </div>
            <Dialog.Close className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white">
              <X className="h-5 w-5" />
              <span className="sr-only">Close expanded image</span>
            </Dialog.Close>
          </div>

          <div
            className={cn(
              'mt-5 overflow-hidden rounded-[1.75rem] border border-white/10 shadow-2xl shadow-slate-950/30',
              visualSurface === 'dark'
                ? 'bg-slate-950'
                : 'bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'
            )}
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-3 py-3 text-xs text-slate-300 sm:px-5">
              <p className="hidden font-mono uppercase tracking-[0.18em] text-slate-400 sm:block">
                Click diagram to cycle zoom
              </p>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-medium text-slate-200">
                {zoomStep.label}
              </span>
            </div>

            <div className="max-h-[82vh] overflow-auto p-1 sm:max-h-[78vh] sm:p-4">
              <button
                type="button"
                onClick={cycleZoom}
                className="block w-full cursor-zoom-in focus-visible:rounded-[1.5rem]"
                aria-label={`Cycle zoom for ${title}. Current mode: ${zoomStep.label}.`}
              >
                <div
                  className={cn(
                    'relative transition-[width] duration-300 ease-out',
                    visualAspect === 'portrait'
                      ? 'mx-auto aspect-[4/5]'
                      : 'aspect-[16/10]'
                  )}
                  style={imageFrameStyle}
                >
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    className="select-none object-contain"
                    sizes={sizes}
                    draggable={false}
                  />
                </div>
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
