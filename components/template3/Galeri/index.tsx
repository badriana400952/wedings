const Galeri = ({ data }: { data?: any }) => {
  const fotos: string[] = data?.galery?.fotos && data.galery.fotos.length > 0
    ? data.galery.fotos
    : [
        "/assets/images/bg.png",
        "/assets/images/bg2.jpg",
        "https://images.unsplash.com/photo-1519741497674-611481863552",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
      ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-black overflow-hidden py-16 md:py-32">
      <div id="boxImage" className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto px-4">
        {fotos.map((fotoUrl, key) => (
          <span
            key={key}
            style={{ ["--i" as any]: key + 1 }}
            className="block"
          >
            <img
              src={fotoUrl}
              alt={`Galeri ${key + 1}`}
              className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Galeri;