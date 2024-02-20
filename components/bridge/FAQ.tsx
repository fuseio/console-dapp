const FAQ = () => {
  return (
    <div className="flex flex-col items-center gap-2 border border-black/10 rounded-lg p-[29.5px] w-full">
      <p className="font-semibold">
        Do you have questions?
      </p>
      <div className="flex items-center gap-0.5 text-sm">
        <p className="text-black opacity-50">
          Contact us or read the
        </p>
        <a
          href="https://north-crocus-61d.notion.site/Fuse-Bridge-FAQ-4e9b409ab87845b3b9a8573f4fe2ff0e"
          target="_blank"
          className="transition ease-in-out font-semibold underline hover:opacity-60"
        >
          FAQ
        </a>
      </div>
    </div>
  )
}

export default FAQ;
