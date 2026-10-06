interface ResponsiveHeroImageProps {
  alt: string
  className?: string
  preload?: boolean
}

const srcSet = [
  '/images/hero/kitchen-640.webp 640w',
  '/images/hero/kitchen-960.webp 960w',
  '/images/hero/kitchen-1600.webp 1600w',
].join(', ')

const sizes = '(min-width: 1024px) 54vw, 100vw'

export function ResponsiveHeroImage({
  alt,
  className,
  preload = false,
}: ResponsiveHeroImageProps) {
  return (
    <>
      {preload ? (
        <link
          rel="preload"
          as="image"
          href="/images/hero/kitchen-1600.webp"
          imageSrcSet={srcSet}
          imageSizes={sizes}
          type="image/webp"
        />
      ) : null}
      <img
        src="/images/hero/kitchen-1600.webp"
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={1600}
        height={1200}
        loading="eager"
        decoding="async"
        className={className}
      />
    </>
  )
}
