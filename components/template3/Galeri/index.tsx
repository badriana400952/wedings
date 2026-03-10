const Galeri = () => {
  const galeri = [...Array(10)];

  return (
    <div className="flex items-center justify-center min-h-screen bg-black overflow-hidden py-16 md:py-32">
      <div id="boxImage" className="flex flex-wrap justify-center gap-4">
        {galeri.map((_, key) => (
          <span
            key={key}
            style={{ ["--i" as any]: key + 1 }}
            className="block"
          >
            <img
              src={`/images/galeri-${key + 1}.jpg`}
              alt={`Galeri ${key + 1}`}
              className="w-40 h-40 object-cover rounded-lg"
            />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Galeri;