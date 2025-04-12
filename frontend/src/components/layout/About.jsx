import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

const About = () => {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <img
            src="/placeholder.svg?height=400&width=500"
            alt="Medical professionals"
            className="w-full max-w-lg mx-auto"
          />
        </div>
        <div>
          <div className="inline-block px-4 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-medium mb-4">
            ABOUT US
          </div>
          <h2 className="text-3xl font-bold mb-6">
            We Are Specialize in
            <br />
            Medical Diagnositics
          </h2>
          <p className="text-muted-foreground mb-6">
            Nulla lacinia sapien e diam elementum, sed congue leo vulputate.
            Praesent et ante ultricies, congue purus vitae, sagittis quam. Donec
            urna lectus, auctor quis tristique tincidunt, semper vel lectus.
            Mauris eget volutpat massa. Praesent et felis, semper nec tellus in,
            blandit commodo ipsum.
          </p>

          <div className="space-y-4">
            <div className="flex items-center">
              <ChevronRight className="text-primary mr-2" />
              <p>Pellentesque placerat, nisl congue vehicula efficitur.</p>
            </div>
            <div className="flex items-center">
              <ChevronRight className="text-primary mr-2" />
              <p>Pellentesque placerat, nisl congue vehicula efficitur.</p>
            </div>
            <div className="flex items-center">
              <ChevronRight className="text-primary mr-2" />
              <p>
                Praesent mattis vitae magna in suscipit. Nam tristique posuere
                sem, mattis molestie est bibendum.
              </p>
            </div>
          </div>

          <Button variant="default" className="mt-8 flex items-center">
            Read More <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
export default About;
