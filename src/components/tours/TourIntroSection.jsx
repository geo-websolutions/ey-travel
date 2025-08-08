export default function TourIntroSection({ destinationData }) {
  return (
    <section className="py-16 container mx-auto px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold mb-6">
          {destinationData.title1} <span className="text-amber-400">{destinationData.title2}</span> {destinationData.title3 ? destinationData.title3 : ''}
        </h2>
        <p className="text-lg mb-6">
          {destinationData.paragraph}
        </p>
      </div>
    </section>
  )
}