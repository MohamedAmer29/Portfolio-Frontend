type PhotoFrameProps = {
  src: string
  alt: string
}

export function PhotoFrame({ src, alt }: PhotoFrameProps) {
  return (
    <div className="photo-frame">
      <img src={src} alt={alt} />
    </div>
  )
}