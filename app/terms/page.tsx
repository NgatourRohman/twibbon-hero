export default function TermsPage() {
  return (
    <article className="container-page max-w-4xl py-10 sm:py-16">
      <div className="glass-panel rounded-[24px] p-5 sm:rounded-[30px] sm:p-12">
      <p className="section-label">Legal</p>
      <h1 className="gradient-text mt-2 font-[var(--font-display)] text-3xl font-extrabold sm:text-4xl">Terms of use</h1>
      <div className="mt-8 space-y-5 leading-8 text-muted-foreground">
        <p>You may only upload campaign assets that you own or have permission to use. Campaigns must not contain illegal, deceptive, hateful, or privacy-infringing content.</p>
        <p>Administrators may reject or remove campaigns that violate these terms. You remain responsible for the content you publish and share.</p>
      </div>
      </div>
    </article>
  );
}
