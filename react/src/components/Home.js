import React from "react";
import { LeadForm } from "react-boilerplate-leadform";
import {
  PageWidth,
  Seo,
  PostContent,
  useSingle,
} from "react-boilerplate-nodes";

import Button, { ButtonClasses } from "./elements/Button";
import Hero from "./elements/Hero";
import Image from "./elements/Image";

const Home = () => {
  const {
    node: { seo = {}, content },
    error,
  } = useSingle();

  return (
    <div className="home">
      <Seo title={seo.title} description={seo.metaDesc} canonical="/" />

      <Hero cta={{ text: "Contact Today", link: "/contact-us" }} />

      <PageWidth className="overflow-hidden">
        <div className="mv4 flex-l nl4 nr4">
          <div className="ma4 w-50-l">
            <PostContent className="mb4" content={content || error || ""} />

            <Button className="mr3" to="/contact-us">
              Make an Appointment
            </Button>

            <Button type={3} to="/about-us">
              Learn More
            </Button>
          </div>
          <div className="ma4 w-50-l">
            <div className="relative overflow-hidden w-100 h-100">
              <Image
                width={720}
                height={480}
                className="absolute-l absolute--fill-l mw-none-l grow center db"
              />
            </div>
          </div>
        </div>
      </PageWidth>

      <div className="bg-silver pv5">
        <LeadForm
          className="mw6 bg-white pa4 center"
          classes={{ button: ButtonClasses.buttonType1 }}
        />
      </div>
    </div>
  );
};

export default Home;
