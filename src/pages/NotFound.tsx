import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found" description="The page you are looking for could not be found." path="/404" />

      <section className="flex min-h-[70vh] items-center justify-center bg-cream-100 px-4">
        <div className="text-center">
          <p className="font-display text-7xl font-semibold text-primary">404</p>
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink">
            Page not found
          </h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            The page you are looking for does not exist or has been moved. You can return to the home page or browse our rooms.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild>
              <Link to="/">
                <Home className="mr-1 h-4 w-4" /> Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/rooms">
                <ArrowLeft className="mr-1 h-4 w-4" /> Browse Rooms
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
