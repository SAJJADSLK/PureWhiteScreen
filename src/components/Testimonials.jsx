export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Content Creator',
      text: 'Pure White Screen has completely transformed my streaming setup! The ring light simulator is incredibly realistic.',
      rating: 5,
    },
    {
      name: 'Mike Chen',
      role: 'Streamer',
      text: 'Best free tool for content creators. No signup required, no ads, just pure utility. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Emma Wilson',
      role: 'Video Editor',
      text: 'Love the ambient spaces feature. Perfect for focus sessions and productivity. The ocean waves really help me concentrate.',
      rating: 5,
    },
    {
      name: 'David Brown',
      role: 'Photographer',
      text: 'Great alternative to expensive lighting equipment. Works perfectly for video calls and streaming. Five stars!',
      rating: 5,
    },
  ]

  return (
    <div className="my-20">
      <h2 className="text-3xl font-bold mb-12 text-center">What Users Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((testimonial, idx) => (
          <div key={idx} className="bg-slate-800 p-6 rounded-lg">
            <div className="flex gap-1 mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <span key={i} className="text-yellow-400">⭐</span>
              ))}
            </div>
            <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
            <div>
              <p className="font-bold">{testimonial.name}</p>
              <p className="text-sm text-gray-400">{testimonial.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
