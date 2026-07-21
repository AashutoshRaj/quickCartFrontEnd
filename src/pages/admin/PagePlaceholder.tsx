interface PagePlaceholderProps {
  title: string;
  parent: string;
  description?: string;
}

export function PagePlaceholder({ title, parent, description }: PagePlaceholderProps) {
  return (
    <div className="p-6">
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1" style={{ fontWeight: 500 }}>{parent}</p>
      <h1 className="text-2xl text-gray-900" style={{ fontWeight: 600 }}>{title}</h1>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      <div className="mt-8 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center h-64 text-gray-300 text-sm">
        {title} content loaded
      </div>
    </div>
  );
}
