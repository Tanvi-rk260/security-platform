'use client';
export default function MetaReport({ meta }) {
    return (
      <div className="">
        <h2 className="text-lg font-bold">Security Meta Tag Report:</h2>
        <ul className="mt-2 list-disc pl-4">
          {meta.length === 0 ? (
            <li>No meta tags found or URL unreachable.</li>
          ) : (
            meta.map((tag, i) => (
              <li key={i}>
                <strong>{tag.name}</strong>: {tag.content}
              </li>
            ))
          )}
        </ul>
      </div>
    );
  }
  
