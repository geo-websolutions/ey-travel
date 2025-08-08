export default function TourWhyVisitSection({ destinationData }){
  return (
    <section className="py-16 bg-stone-800/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why Visit <span className="text-amber-400">{destinationData.city}</span>?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-stone-800/50 p-6 rounded-lg border border-stone-700">
              <h3 className="text-xl font-bold mb-3 text-amber-400">{destinationData.title1}</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2">•</span>
                  <span>{destinationData.span1}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2">•</span>
                  <span>{destinationData.span2}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2">•</span>
                  <span>{destinationData.span3}</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-stone-800/50 p-6 rounded-lg border border-stone-700">
              <h3 className="text-xl font-bold mb-3 text-amber-400">{destinationData.title2}</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2">•</span>
                  <span>{destinationData.span4}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2">•</span>
                  <span>{destinationData.span5}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2">•</span>
                  <span>{destinationData.span6}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}