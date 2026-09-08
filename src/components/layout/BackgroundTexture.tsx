/**
 * Fixed, layered background sitting behind all content: drifting risograph
 * washes + a fine ink dot grid on warm paper. Purely decorative.
 */
export default function BackgroundTexture() {
  return (
    <>
      <div className="bg-layer bg-wash" aria-hidden="true">
        <span className="wash-1" />
        <span className="wash-2" />
        <span className="wash-3" />
      </div>
      <div className="bg-layer bg-grid" aria-hidden="true" />
    </>
  )
}
