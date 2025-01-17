"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Twitter, Linkedin, Github } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Turnstile {
  render: (container: string | HTMLElement, options: object) => string;
  reset: (widgetId?: string) => void;
  getResponse: (widgetId?: string) => string | undefined;
  remove: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile: Turnstile;
  }
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load Turnstile script
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = document.querySelector<HTMLInputElement>(
        '[name="cf-turnstile-response"]'
      )?.value;

      if (!token) {
        throw new Error("Please complete the challenge");
      }

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setEmail("");
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to subscribe. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
      // Reset Turnstile
      window.turnstile?.reset();
    }
  };

  return (
    <div className="container mx-auto px-4 space-y-12 py-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
          The Open Web Conference
        </h1>
        <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Join us in celebrating open-source innovation and community
          collaboration at the premier event for open web advocates.
        </p>
        <Button asChild>
          <Link href="#subscribe">Stay Updated</Link>
        </Button>
      </section>

      <section id="about" className="space-y-4 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold">What is the Open Web Conference?</h2>
        <p>
          The Open Web Conference is the flagship event dedicated to fostering a
          global conversation about the power of open-source and the open web.
          This conference brings together developers, designers, business
          leaders, educators, and enthusiasts to explore the latest
          advancements, share ideas, and build a better web for everyone.
        </p>
        <p className="font-bold text-lg">Key Themes:</p>
        <ul className="list-disc list-inside">
          <li>
            <span className="font-bold">Open Collaboration:</span> Building
            tools and communities that thrive on transparency and accessibility.
          </li>
          <li>
            <span className="font-bold">Innovation:</span> Showcasing
            cutting-edge projects and ideas shaping the future of open
            technologies.
          </li>
          <li>
            <span className="font-bold">Education:</span> Equipping attendees
            with the knowledge and resources to contribute to the open-source
            ecosystem.
          </li>
        </ul>
      </section>

      <section id="mission" className="space-y-4 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold">Our Mission</h2>
        <p>
          <span className="font-bold">At Open Web Conference</span>, our mission
          is simple:
        </p>
        <ul className="list-disc list-inside">
          <li>Advocate for open-source principles.</li>
          <li>
            Empower individuals and organizations to collaborate and innovate.
          </li>
          <li>
            Build a stronger, more inclusive community that champions the open
            web.
          </li>
        </ul>
        <p>
          We believe the web belongs to everyone, and through shared knowledge
          and effort, we can ensure it remains accessible, equitable, and open
          to all.
        </p>
      </section>

      <section id="subscribe" className="space-y-4 max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-center">
          Be Part of the Movement
        </h2>
        <p className="text-center text-muted-foreground">
          Whether you’re a seasoned contributor or just starting your journey in
          open-source, the Open Web Conference is for you. Stay informed about
          event updates, speaker announcements, and opportunities to get
          involved by joining our mailing list.
        </p>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="flex justify-center">
            <div
              className="cf-turnstile"
              data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              data-theme="auto"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </section>

      <section className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Connect With Us</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:space-x-4">
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link
              href="https://x.com/OpenWebEvents"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="mr-2 h-4 w-4" />
              Twitter
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link
              href="https://www.linkedin.com/company/openwebevents"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="mr-2 h-4 w-4" />
              LinkedIn
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link
              href="https://github.com/OpenWebEvents"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Link>
          </Button>
        </div>
      </section>

      <section className="text-center space-y-2 text-sm text-muted-foreground">
        <Link href="/privacy-policy" className="hover:underline">
          Privacy Policy
        </Link>
        <span> | </span>
        <Link href="/code-of-conduct" className="hover:underline">
          Code of Conduct
        </Link>
      </section>
    </div>
  );
}
