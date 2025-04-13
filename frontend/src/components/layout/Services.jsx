import { Card, CardContent } from "../ui/card";
import Magnet from "../ui/magnet";

const Services = () => {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <div className="inline-block px-4 py-1 bg-secondary/20 text-muted-foreground rounded-full text-sm font-medium mb-4">
          OUR SERVICES
        </div>
        <h2 className="text-3xl font-bold mb-4">
          Our Special Services For You
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          We built MedChain AI, a blockchain-powered healthcare ecosystem that
          gives patients control of their health data while providing
          AI-assisted insights for better clinical decision-making.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Service 1 */}
        <Magnet padding={50} disabled={false} magnetStrength={5}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M7 10v12"></path>
                  <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Reliability and Trust</h3>
              <p className="text-muted-foreground">
                Blockchain are completely secured and no one else can access
                without the user consent.
              </p>
            </CardContent>
          </Card>
        </Magnet>

        {/* Service 2 */}
        <Magnet padding={50} disabled={false} magnetStrength={5}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"></path>
                  <path d="M8 10h8"></path>
                  <path d="M8 14h8"></path>
                  <path d="M8 18h8"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">
                80% Accurate Disease Prediction
              </h3>
              <p className="text-muted-foreground">
                Our SVC model trained on Kaggle datasets achieves 80% accuracy
                in our tests. We position this as a decision support tool for
                doctors, not a replacement.
              </p>
            </CardContent>
          </Card>
        </Magnet>

        {/* Service 3 */}
        <Magnet padding={50} disabled={false} magnetStrength={5}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="m12 14 4-4"></path>
                  <path d="M3.34 19a10 10 0 1 1 17.32 0"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">General AI Assistant</h3>
              <p className="text-muted-foreground">
                Patients can ask general questions like Diet Plans and Exercises
                on the basis of their report.
              </p>
            </CardContent>
          </Card>
        </Magnet>
      </div>
    </div>
  );
};
export default Services;
