const Lokasi = () => {
  const gmaps: any = {
    iframeSrc: "",
  };

  return (
    <div className="py-16 bg-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <iframe
          title="Google Maps"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={gmaps?.iframeSrc}
          className="w-full h-[450px] border-0 rounded-lg"
        />
      </div>
    </div>
  );
};

export default Lokasi;