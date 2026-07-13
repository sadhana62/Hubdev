import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <section className="home-page overflow-x-hidden bg-[#0f172a] text-on-surface">
      {/* Hero Section */}
      <section className="relative pt-xxl pb-xxl px-margin-desktop max-w-max-width mx-auto min-h-[819px] flex flex-col lg:flex-row items-center gap-xxl">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="flex-1 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-xs px-md py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-xl">
            <span className="material-symbols-outlined text-[16px]">terminal</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest">v2.0 Beta Now Live</span>
          </div>
          <h1 className="font-display text-display mb-lg leading-tight tracking-tight text-on-surface">
            Where Code <span className="text-gradient">Finds Its Community</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-xl mx-auto lg:mx-0">
            The ultimate developer ecosystem for sharing open-source projects, writing technical insights, and building a professional portfolio that speaks for itself.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-md">
            <button
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto bg-primary text-on-primary font-bold px-xl py-md rounded-xl hover:shadow-[0_0_20px_rgba(192,193,255,0.4)] transition-all flex items-center justify-center gap-sm cursor-pointer"
            >
              Get Started
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button
              onClick={() => navigate("/stack")}
              className="w-full sm:w-auto bg-white/5 border border-white/10 text-on-surface font-medium px-xl py-md rounded-xl hover:bg-white/10 transition-all cursor-pointer"
            >
              Explore Projects
            </button>
          </div>
        </div>

        {/* Hero Illustration */}
        <div className="flex-1 w-full max-w-2xl lg:max-w-none">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative glass-card rounded-xl overflow-hidden border border-white/10 aspect-video shadow-2xl">
              <img
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                alt="A futuristic developer workspace at night"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy4rxYf4LBDgrpzxoXr_fUR4X17LO4p-35Ne-zQX0TGJPBqAnAyVCHZqdjYbLhezn5xSn5TnHFYJCo1L6R7fHUBODyr65b3VM-mn5grCKWaDVqPJnRDT-E8tJTKaho3mK2uPIX-JHM7RAYXDw2pCJfCJMeXg5tswyfLWDRVTm4pnBUeBm11dHTPlnp3c80PFSoQjfhlDqShPKFhnYhRZ6ZnITWygJMXsqNKFemO1dzdpJaiaInUhl5urqwHcJfMoKQCceE49lyX_Y"
              />
              {/* Code Overlay */}
              <div className="absolute bottom-4 left-4 p-md glass-card rounded-lg flex items-center gap-md">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="font-label-sm text-label-sm text-on-surface/80">system.status: "building_community"</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-surface-container-lowest/50 py-xl border-y border-white/5">
        <div className="max-w-max-width mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-xl">
          <div className="text-center">
            <div className="font-display text-headline-lg text-primary mb-xs">50k+</div>
            <div className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Developers</div>
          </div>
          <div className="text-center">
            <div className="font-display text-headline-lg text-primary mb-xs">1M+</div>
            <div className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Posts</div>
          </div>
          <div className="text-center">
            <div className="font-display text-headline-lg text-primary mb-xs">200k+</div>
            <div className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Projects</div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="py-xxl px-margin-desktop max-w-max-width mx-auto">
        <div className="flex flex-col items-center text-center mb-xxl">
          <h2 className="font-display text-headline-lg mb-md text-on-surface">Engineered for the Modern Dev</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Everything you need to showcase your craft and connect with technical leaders across the globe.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-lg auto-rows-[280px]">
          {/* Share Projects */}
          <div
            onClick={() => navigate("/stack")}
            className="md:col-span-8 glass-card rounded-xl p-xl flex flex-col justify-end group cursor-pointer hover:border-primary/50 transition-colors"
          >
            <div className="mb-auto">
              <span className="material-symbols-outlined text-primary text-4xl mb-md">share</span>
              <h3 className="font-headline-md text-headline-md mb-sm text-on-surface">Share Projects</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
                Deploy your repositories directly into the DevHub ecosystem with seamless GitHub integration.
              </p>
            </div>
            <div className="flex gap-sm mt-md opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="font-label-sm text-label-sm text-primary px-md py-1 bg-primary/10 rounded-full border border-primary/20">
                Open Source
              </span>
              <span className="font-label-sm text-label-sm text-primary px-md py-1 bg-primary/10 rounded-full border border-primary/20">
                Public Repos
              </span>
            </div>
          </div>

          {/* Trending Tech */}
          <div className="md:col-span-4 bg-primary text-on-primary rounded-xl p-xl flex flex-col justify-between">
            <div>
              <h3 className="font-headline-md text-headline-md mb-md text-on-primary">Trending Tech</h3>
              <div className="flex flex-wrap gap-sm">
                <span className="font-label-sm text-label-sm bg-on-primary/10 px-md py-1 rounded-full flex items-center gap-xs">
                  <span className="material-symbols-outlined text-sm">rocket_launch</span> React
                </span>
                <span className="font-label-sm text-label-sm bg-on-primary/10 px-md py-1 rounded-full flex items-center gap-xs">
                  <span className="material-symbols-outlined text-sm">settings</span> Rust
                </span>
                <span className="font-label-sm text-label-sm bg-on-primary/10 px-md py-1 rounded-full flex items-center gap-xs">
                  <span className="material-symbols-outlined text-sm">code</span> Go
                </span>
                <span className="font-label-sm text-label-sm bg-on-primary/10 px-md py-1 rounded-full flex items-center gap-xs">
                  <span className="material-symbols-outlined text-sm">psychology</span> AI
                </span>
                <span className="font-label-sm text-label-sm bg-on-primary/10 px-md py-1 rounded-full">
                  TypeScript
                </span>
              </div>
            </div>
            <div className="text-sm opacity-80 font-label-sm">Updated 5m ago</div>
          </div>

          {/* Developer Posts */}
          <div className="md:col-span-4 glass-card rounded-xl p-xl flex flex-col justify-between hover:border-primary/50 transition-colors">
            <span className="material-symbols-outlined text-primary text-3xl">article</span>
            <div>
              <h3 className="font-headline-md text-headline-md mb-sm text-on-surface">Developer Posts</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Write long-form technical blogs or quick snippets of wisdom.
              </p>
            </div>
          </div>

          {/* Build Portfolio */}
          <div className="md:col-span-4 glass-card rounded-xl p-xl flex flex-col justify-between border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all">
            <span className="material-symbols-outlined text-primary text-3xl">account_circle</span>
            <div>
              <h3 className="font-headline-md text-headline-md mb-sm text-on-surface">Build Portfolio</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Your DevHub profile is your new CV. Auto-synced from your activity.
              </p>
            </div>
          </div>

          {/* Connect */}
          <div className="md:col-span-4 glass-card rounded-xl p-xl flex flex-col justify-between hover:border-primary/50 transition-colors overflow-hidden relative">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full"></div>
            <span className="material-symbols-outlined text-primary text-3xl">groups</span>
            <div>
              <h3 className="font-headline-md text-headline-md mb-sm text-on-surface">Connect</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Find co-founders, collaborators, or mentors in specific tech stacks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-xxl px-margin-desktop max-w-max-width mx-auto">
        <div className="relative glass-card rounded-2xl p-xxl overflow-hidden border border-primary/20">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="font-display text-display mb-lg text-on-surface">Ready to build the future?</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-2xl">
              Join the fastest-growing network of engineers and start contributing to the projects that matter.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="bg-primary text-on-primary font-bold px-xxl py-md rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
            >
              Join DevHub Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-lowest w-full py-xxl border-t border-white/10">
        <div className="max-w-max-width mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-md">
          <div className="flex flex-col gap-sm text-center md:text-left">
            <span className="font-headline-md text-headline-md font-bold text-on-surface">DevHub</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              © 2024 DevHub Inc. Built for developers by developers.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-xl">
            <a className="text-on-surface-variant font-label-sm text-label-sm hover:text-on-surface transition-colors" href="#">
              Privacy
            </a>
            <a className="text-on-surface-variant font-label-sm text-label-sm hover:text-on-surface transition-colors" href="#">
              Terms
            </a>
            <a className="text-on-surface-variant font-label-sm text-label-sm hover:text-on-surface transition-colors" href="#">
              API
            </a>
            <a className="text-on-surface-variant font-label-sm text-label-sm hover:text-on-surface transition-colors" href="#">
              Status
            </a>
            <a className="text-on-surface-variant font-label-sm text-label-sm hover:text-on-surface transition-colors" href="#">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
}
