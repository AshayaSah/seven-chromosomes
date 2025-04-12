import { Card, CardContent } from "../ui/card";

const StatsSection = () => {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Stat 1 */}
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
            <h3 className="text-3xl font-bold text-primary">500+</h3>
            <p className="text-muted-foreground">Doctors At Work</p>
          </CardContent>
        </Card>

        {/* Stat 2 */}
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
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-primary">58796+</h3>
            <p className="text-muted-foreground">Happy Patients</p>
          </CardContent>
        </Card>

        {/* Stat 3 */}
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
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-primary">500+</h3>
            <p className="text-muted-foreground">Medical Beds</p>
          </CardContent>
        </Card>

        {/* Stat 4 */}
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
                <path d="M8.21 13.89 7 23l9-9-8.99-9L7.2 13.9"></path>
                <path d="M14.32 17.32 18 12a4 4 0 0 0-6.24-5 4 4 0 0 0-1.2 5.24 4 4 0 0 0 .24.26l3.54 3.82"></path>
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-primary">200+</h3>
            <p className="text-muted-foreground">Winning Awards</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default StatsSection;
