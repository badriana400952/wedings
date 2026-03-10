import Footer from "../template3/Footer";
import Galeri from "../template3/Galeri";
import Hero from "../template3/Hero";
import GuestLayout from "../template3/Layouts/GuestLayout";
import Lokasi from "../template3/Lokasi";
import Mempelai from "../template3/Mempelai";
import Tanggal from "../template3/Tanggal";
import Words from "../template3/Words";


/**
 * Home page
 *
 * @returns React.ReactElement
 */
const Home = () => {
  return (
    <GuestLayout>
      <section id="hero">
        <Hero />
      </section>

      <section id="words">
        <Words />
      </section>

      <section id="mempelai">
        <Mempelai />
      </section>

      <section id="tanggal">
        <Tanggal />
      </section>

      <section id="lokasi">
        <Lokasi />
      </section>

      <section id="galeri">
        <Galeri />
      </section>

      <footer id="footer">
        <Footer />
      </footer>
    </GuestLayout>
  );
};

export default Home;