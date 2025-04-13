import { Card, CardContent } from "../ui/card";
import Magnet from "../ui/magnet";

const StatsSection = () => {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Stat 1 */}
        <Magnet padding={50} disabled={false} magnetStrength={5}>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
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
                  <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path>
                  <line x1="8" y1="16" x2="8.01" y2="16"></line>
                  <line x1="8" y1="20" x2="8.01" y2="20"></line>
                  <line x1="12" y1="18" x2="12.01" y2="18"></line>
                  <line x1="12" y1="22" x2="12.01" y2="22"></line>
                  <line x1="16" y1="16" x2="16.01" y2="16"></line>
                  <line x1="16" y1="20" x2="16.01" y2="20"></line>
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-primary">BlockChain</h3>
              <p className="text-muted-foreground">Secure Records</p>
            </CardContent>
          </Card>
        </Magnet>

        {/* Stat 2 */}
        <Magnet padding={50} disabled={false} magnetStrength={5}>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
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
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-primary">80%</h3>
            <p className="text-muted-foreground">AI Prediction Accuracy</p>
          </CardContent>
        </Card>
        </Magnet>

        {/* Stat 3 */}
        <Magnet padding={50} disabled={false} magnetStrength={5}>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-primary">AI Assistance</h3>
            <p className="text-muted-foreground">For Patients</p>
          </CardContent>
        </Card>
        </Magnet>

        {/* Stat 4 */}
        <Magnet padding={50} disabled={false} magnetStrength={5}>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
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
                <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path>
                <line x1="2" y1="20" x2="2.01" y2="20"></line>
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-primary">
              Disease Prediction
            </h3>
            <p className="text-muted-foreground">For Doctors</p>
          </CardContent>
        </Card>
        </Magnet>s
      </div>
    </div>
  );
};

export default StatsSection;
