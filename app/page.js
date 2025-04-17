import Image from "next/image";
import Hero from "components/Hero";
import AboutPage from "./about/page";
import ContactPage from "./contact/page";

export default function Home() {
  return (<>
  
   <div className="">

    <Hero/>
    <AboutPage/>
    <ContactPage/>
  
    
   </div>
   </>
   
  );
}
