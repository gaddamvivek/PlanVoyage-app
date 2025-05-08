export default function Footer() {
  return (
    <div id="footer" className="flex flex-col mt-10 md:flex-row items-center justify-between text-white bg-black p-6 md:p-12 space-y-6 md:space-y-0">
      <div className="md:w-1/2">
        <h1 className="text-xl font-bold">About Us</h1>
        <p className="mt-2">
          Plan Voyage is a travel genome platform that curates personalized
          destination recommendations based on your unique preferences. Whether
          you crave adventure, culture, or relaxation, we match you with places
          that fit your travel DNA. Let us take the guesswork out of
          planning—your next perfect trip starts here!
        </p>
      </div>
      <div className="md:w-1/2 text-center ">
        <h1 className="text-xl font-bold">Contact</h1>
        <p className="mt-2">planvoyage25@gmail.com</p>
      </div>
    </div>
  );
}
