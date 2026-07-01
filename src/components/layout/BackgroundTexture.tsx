/**
 * Fixed, layered background texture sitting behind all content:
 * drifting gold aurora blobs + a fine dotted grid. Purely decorative.
 */
export default function BackgroundTexture() {
  return (
    <>
      <div className="bg-layer bg-aurora" aria-hidden="true">
        <span className="aurora-1" />
        <span className="aurora-2" />
        <span className="aurora-3" />
      </div>
      <div className="bg-layer bg-grid" aria-hidden="true" />
    </>
  )
}
