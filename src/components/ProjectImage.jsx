import { useState } from 'react'

function ProjectImage({ src, alt, initials, loading = 'lazy', width = '640', height = '400' }) {
  const [unavailable, setUnavailable] = useState(!src)

  return (
    <>
      {src && !unavailable ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          width={width}
          height={height}
          onError={() => setUnavailable(true)}
        />
      ) : (
        <div className="image-fallback" role="img" aria-label={`${alt} — imagem indisponível`}>
          <span className="ph-t" aria-hidden="true">{initials}</span>
          <span>Imagem indisponível</span>
        </div>
      )}
    </>
  )
}

export default ProjectImage
