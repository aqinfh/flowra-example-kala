/** The honesty strip: this is a sample site and Kala is fictional. */
export function SampleBanner() {
  return (
    <div className="bg-ink px-4 py-2 text-center text-xs text-paper">
      <p>
        Sample site built on{" "}
        <a className="underline underline-offset-2" href="https://withflowra.com">
          Flowra
        </a>{" "}
        · Kala Coffee Roasters is a fictional company ·{" "}
        <a className="underline underline-offset-2" href="https://github.com/aqinfh/flowra-example-kala">
          Source on GitHub
        </a>
      </p>
    </div>
  );
}
