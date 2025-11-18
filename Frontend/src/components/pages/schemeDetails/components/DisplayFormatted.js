// import React from "react";

// const renderChildren = (children) => {
//     if (!children) return null;
//     return children.map((child, index) => {
//         const style = {};
//         const text = child.text || '';

//         if (child.bold) style.fontWeight = 'bold';
//         if (child.underline) style.textDecoration = 'underline';
//         if (child.italic) style.fontStyle = 'italic';

//         // Check for type "link" and handle separately
//         if (child.type === "link") {
//             return (
//                 <a
//                     href={child.link}
//                     key={index}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:underline"
//                 >
//                     {renderChildren(child.children)} {/* Render children of the link if present */}
//                 </a>
//             );
//         }

//         // Ensure text is handled even if empty
//         return (
//             <span key={index} style={style}>
//                 {text || ''}
//             </span>
//         );
//     });
// };


// const TableComponent = ({ children }) => (
//     <div className="overflow-x-auto my-4">
//         <table className="min-w-full border-collapse border border-gray-300">
//             <tbody>
//                 {children.map((row, index) => (
//                     <tr key={index} className="border-b border-gray-300">
//                         {row.children.map((cell, cellIndex) => (
//                             <td key={cellIndex} className="p-2 border-r border-gray-300">
//                                 {renderChildren(cell.children)}
//                             </td>
//                         ))}
//                     </tr>
//                 ))}
//             </tbody>
//         </table>
//     </div>
// );

// const ListItem = ({ item }) => {
//     if (!item?.type === "list_item") return null;

//     // Find any nested lists in the item's children
//     const listContent = [];
//     const textContent = [];

//     item.children?.forEach(child => {
//         if (child.type === "ol_list") {
//             listContent.push(child);
//         } else {
//             textContent.push(child);
//         }
//     });

//     return (
//         <li className="mb-2">
//             {textContent.length > 0 && renderChildren(textContent)}
//             {listContent.map((list, index) => (
//                 <ol key={index} className="list-decimal pl-6 mt-2">
//                     {list.children.map((child, childIndex) => (
//                         <ListItem key={childIndex} item={child} />
//                     ))}
//                 </ol>
//             ))}
//         </li>
//     );
// };

// const processListItems = (items) => {
//     return items.map((item, index) => {
//         if (item.type === "ol_list") {
//             return (
//                 <ol key={index} className="list-decimal pl-6 mt-2">
//                     {processListItems(item.children)}
//                 </ol>
//             );
//         }
//         if (item.type === "list_item") {
//             return (
//                 <li key={index} className="mb-2">
//                     {renderChildren(item.children.filter(child => child.type !== "ol_list"))}
//                     {item.children.filter(child => child.type === "ol_list").map((sublist, subIndex) => (
//                         <ol key={subIndex} className="list-decimal pl-6 mt-2">
//                             {processListItems(sublist.children)}
//                         </ol>
//                     ))}
//                 </li>
//             );
//         }
//         return null;
//     });
// };

// const RenderList = ({ list }) => {
//     if (!list?.children) return null;

//     return (
//         <ol className="list-decimal pl-6 my-4 space-y-2">
//             {processListItems(list.children)}
//         </ol>
//     );
// };

// const AlignJustify = ({ content }) => {
//     return content.map((item, index) => {
//         switch (item.type) {
//             case "ol_list":
//                 return (
//                     <RenderList key={index} list={item} />
//                 );
//             case "paragraph":
//                 return (
//                     <p key={index} className="my-2">
//                         {renderChildren(item.children)}
//                     </p>
//                 );
//             default:
//                 return null;
//         }
//     });
// };

// const RenderContent = ({ content }) => {
//     if (!content) return null;

//     return content.map((item, index) => {
//         switch (item.type) {
//             case "align_justify":
//                 return (
//                     <div key={index} className="space-y-4">
//                         <AlignJustify content={item.children} />
//                     </div>
//                 );
//             case "paragraph":
//                 return (
//                     <p key={index} className="my-2">
//                         {renderChildren(item.children)}
//                     </p>
//                 );

//             case "block_quote":
//                 return (
//                     <blockquote key={index} className="border-l-4 border-gray-300 pl-4 my-4">
//                         {renderChildren(item.children)}
//                     </blockquote>
//                 );

//             case "ol_list":
//                 return (
//                     <RenderList key={index} list={item} />
//                 );

//             case "ul_list":
//                 return (
//                     <RenderList key={index} list={item} />
//                 );

//             case "table":
//                 return <TableComponent key={index} children={item.children} />;

//             default:
//                 return (
//                     <div key={index} className="my-2">
//                         {renderChildren(item.children)}
//                     </div>
//                 );
//         }
//     });
// };

// const DisplayFormatted = ({ benefitsData }) => {
//     if (!benefitsData || benefitsData.length === 0) {
//         return <div>No data available</div>;
//     }

//     return (
//         <div className="prose max-w-none">
//             {benefitsData.map((item, index) => (
//                 <RenderContent key={index} content={[item]} />
//             ))}
//         </div>
//     );
// };

// export default DisplayFormatted;

// -------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------

// import React from "react";

// /**
//  * DisplayFormatted: generic renderer that supports:
//  *  - simple arrays like [{ name, details, url }]
//  *  - applicationProcess arrays like [{ step, instruction }]
//  *  - faq-like objects [{ question, answer }]
//  *  - existing rich blocks with type/children (keeps previous behavior)
//  *
//  * It is defensive and does not throw on unknown shapes.
//  */

// /* ---------- helper that used to exist: renderChildren for rich blocks ---------- */
// const renderChildren = (children) => {
//     if (!children) return null;
//     return children.map((child, index) => {
//         // If child is a plain string (sometimes happens), render directly
//         if (typeof child === "string") {
//             return <span key={index}>{child}</span>;
//         }

//         const style = {};
//         const text = child.text || '';

//         if (child.bold) style.fontWeight = 'bold';
//         if (child.underline) style.textDecoration = 'underline';
//         if (child.italic) style.fontStyle = 'italic';

//         // Check for type "link" and handle separately
//         if (child.type === "link") {
//             return (
//                 <a
//                     href={child.link || child.url}
//                     key={index}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:underline"
//                 >
//                     {child.children ? renderChildren(child.children) : (child.text || child.label || child.url)}
//                 </a>
//             );
//         }

//         // Ensure text is handled even if empty
//         return (
//             <span key={index} style={style}>
//                 {text || child.label || child.name || ''}
//             </span>
//         );
//     });
// };

// /* ---------- table rendering (keeps previous behavior) ---------- */
// const TableComponent = ({ children }) => (
//     <div className="overflow-x-auto my-4">
//         <table className="min-w-full border-collapse border border-gray-300">
//             <tbody>
//                 {children.map((row, index) => (
//                     <tr key={index} className="border-b border-gray-300">
//                         {row.children.map((cell, cellIndex) => (
//                             <td key={cellIndex} className="p-2 border-r border-gray-300">
//                                 {renderChildren(cell.children)}
//                             </td>
//                         ))}
//                     </tr>
//                 ))}
//             </tbody>
//         </table>
//     </div>
// );

// /* ---------- RenderList and helpers (keeps previous behavior, fixed a small bug) ---------- */
// const ListItem = ({ item }) => {
//     if (!item || item.type !== "list_item") return null;

//     // Find any nested lists in the item's children
//     const listContent = [];
//     const textContent = [];

//     item.children?.forEach(child => {
//         if (child.type === "ol_list" || child.type === "ul_list") {
//             listContent.push(child);
//         } else {
//             textContent.push(child);
//         }
//     });

//     return (
//         <li className="mb-2">
//             {textContent.length > 0 && renderChildren(textContent)}
//             {listContent.map((list, index) => (
//                 <ol key={index} className="list-decimal pl-6 mt-2">
//                     {list.children.map((child, childIndex) => (
//                         <ListItem key={childIndex} item={child} />
//                     ))}
//                 </ol>
//             ))}
//         </li>
//     );
// };

// const processListItems = (items) => {
//     return items.map((item, index) => {
//         if (!item) return null;
//         if (item.type === "ol_list" || item.type === "ul_list") {
//             return (
//                 <ol key={index} className="list-decimal pl-6 mt-2">
//                     {processListItems(item.children)}
//                 </ol>
//             );
//         }
//         if (item.type === "list_item") {
//             return (
//                 <li key={index} className="mb-2">
//                     {renderChildren(item.children.filter(child => child.type !== "ol_list" && child.type !== "ul_list"))}
//                     {item.children.filter(child => child.type === "ol_list" || child.type === "ul_list").map((sublist, subIndex) => (
//                         <ol key={subIndex} className="list-decimal pl-6 mt-2">
//                             {processListItems(sublist.children)}
//                         </ol>
//                     ))}
//                 </li>
//             );
//         }
//         return null;
//     });
// };

// const RenderList = ({ list }) => {
//     if (!list?.children) return null;

//     return (
//         <ol className="list-decimal pl-6 my-4 space-y-2">
//             {processListItems(list.children)}
//         </ol>
//     );
// };

// const AlignJustify = ({ content }) => {
//     return content.map((item, index) => {
//         switch (item.type) {
//             case "ol_list":
//                 return (
//                     <RenderList key={index} list={item} />
//                 );
//             case "paragraph":
//                 return (
//                     <p key={index} className="my-2">
//                         {renderChildren(item.children)}
//                     </p>
//                 );
//             default:
//                 return null;
//         }
//     });
// };

// const RenderContent = ({ content }) => {
//     if (!content) return null;

//     return content.map((item, index) => {
//         if (!item) return null;
//         switch (item.type) {
//             case "align_justify":
//                 return (
//                     <div key={index} className="space-y-4">
//                         <AlignJustify content={item.children} />
//                     </div>
//                 );
//             case "paragraph":
//                 return (
//                     <p key={index} className="my-2">
//                         {renderChildren(item.children)}
//                     </p>
//                 );

//             case "block_quote":
//                 return (
//                     <blockquote key={index} className="border-l-4 border-gray-300 pl-4 my-4">
//                         {renderChildren(item.children)}
//                     </blockquote>
//                 );

//             case "ol_list":
//                 return (
//                     <RenderList key={index} list={item} />
//                 );

//             case "ul_list":
//                 return (
//                     <RenderList key={index} list={item} />
//                 );

//             case "table":
//                 return <TableComponent key={index} children={item.children} />;

//             default:
//                 // fallback: if item has children (array), try renderChildren, else render JSON
//                 if (item.children) {
//                     return (
//                         <div key={index} className="my-2">
//                             {renderChildren(item.children)}
//                         </div>
//                     );
//                 }
//                 return (
//                     <div key={index} className="my-2">
//                         {typeof item === "string" ? item : JSON.stringify(item)}
//                     </div>
//                 );
//         }
//     });
// };

// /* ---------- NEW: Generic renderer for simple shapes ---------- */

// const renderSimpleNameDetails = (item, index) => {
//     return (
//         <div key={index} className="mb-4">
//             {item.name && <h4 className="font-semibold text-gray-900">{item.name}</h4>}
//             {item.details && <p className="text-gray-600 mt-1">{item.details}</p>}
//             {item.url && (
//                 <p className="mt-2">
//                     <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                         Official link
//                     </a>
//                 </p>
//             )}
//         </div>
//     );
// };

// const renderSteps = (items) => {
//     // items might be [{step, instruction}] or simple strings
//     return (
//         <ol className="list-decimal pl-6 space-y-3">
//             {items.map((it, idx) => {
//                 if (!it) return null;
//                 if (typeof it === "string") {
//                     return <li key={idx} className="text-gray-700">{it}</li>;
//                 }
//                 // if object
//                 const label = it.step !== undefined ? `Step ${it.step}` : it.title || null;
//                 const instr = it.instruction || it.instructionText || it.instruction || it.text || it.description || it.instruction;
//                 return (
//                     <li key={idx} className="text-gray-700">
//                         {label && <span className="font-semibold mr-2">{label}:</span>}
//                         <span>{instr || (it.instruction || JSON.stringify(it))}</span>
//                         {it.url && (
//                             <div className="mt-1">
//                                 <a href={it.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                                     Apply / More details
//                                 </a>
//                             </div>
//                         )}
//                     </li>
//                 );
//             })}
//         </ol>
//     );
// };

// /* ---------- Main exported component ---------- */
// const DisplayFormatted = ({ contentData, dataType }) => {
//     // contentData is the array from JSON
//     if (!contentData || (Array.isArray(contentData) && contentData.length === 0)) {
//         return <div>No data available</div>;
//     }

//     // If the items look like rich blocks (object with 'type' and 'children') keep old behavior
//     const looksRich = contentData.some(item => item && (item.type || (item.children && Array.isArray(item.children))));

//     if (looksRich) {
//         return (
//             <div className="prose max-w-none">
//                 {contentData.map((item, index) => (
//                     <RenderContent key={index} content={[item]} />
//                 ))}
//             </div>
//         );
//     }

//     // Handle common simple shapes
//     // 1) benefits / documents: [{name, details, url}]
//     if ((dataType === "benefits" || dataType === "documents") || contentData.every(item => item && (item.name || item.details))) {
//         return (
//             <div>
//                 {contentData.map((item, idx) => renderSimpleNameDetails(item, idx))}
//             </div>
//         );
//     }

//     // 2) applicationProcess: [{step, instruction, url}] or string list
//     if (dataType === "applicationProcess" || contentData.every(item => typeof item === "string" || item.step || item.instruction || item.url)) {
//         return (
//             <div>
//                 {renderSteps(contentData)}
//             </div>
//         );
//     }

//     // 3) FAQ-like: [{question, answer}]
//     if (contentData.every(it => it && (it.question || it.answer))) {
//         return (
//             <div className="space-y-4">
//                 {contentData.map((faq, i) => (
//                     <div key={i} className="bg-gray-50 rounded-xl p-4">
//                         {faq.question && <h4 className="font-semibold text-gray-900">{faq.question}</h4>}
//                         {faq.answer && <p className="text-gray-600 mt-1">{faq.answer}</p>}
//                     </div>
//                 ))}
//             </div>
//         );
//     }

//     // Fallback: print each item raw
//     return (
//         <div className="prose max-w-none">
//             {contentData.map((item, idx) => (
//                 <div key={idx} className="my-2">
//                     {typeof item === "string" ? item : <pre className="whitespace-pre-wrap">{JSON.stringify(item, null, 2)}</pre>}
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default DisplayFormatted;

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

import React from "react";

/**
 * Defensive DisplayFormatted:
 * - Normalizes uncommon dashes and strips invisible control characters
 * - Converts URLs to links
 * - Logs incoming strings (dev only) to help debug truncation
 * - Falls back to showing raw <pre> with whitespace preserved if still odd
 */

const stripInvisible = (s) => {
  if (typeof s !== "string") return s;
  // Remove common control/zero-width characters that sometimes appear in copy-paste:
  // \u200B ZERO WIDTH SPACE, \u200C ZERO WIDTH NON-JOINER, \u200D ZERO WIDTH JOINER, \uFEFF BOM
  return s.replace(/[\u200B\u200C\u200D\uFEFF]/g, "");
};

const normalizeDashes = (s) => {
  if (typeof s !== "string") return s;
  // Replace em dash and en dash with simple hyphen-space for safety
  return s.replace(/[\u2014\u2013]/g, " - ");
};

// NON-GLOBAL url regex (safe; not using /g to avoid lastIndex issues)
const urlRegex = /(\bhttps?:\/\/[^\s)]+)/;

const renderTextWithLinks = (text) => {
  if (text === null || text === undefined) return null;
  if (typeof text !== "string") {
    return <span>{JSON.stringify(text)}</span>;
  }

  // defensive clean
  const cleaned = normalizeDashes(stripInvisible(text));

  // DEV-only logging so you can inspect exact string delivered
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("[DisplayFormatted] renderTextWithLinks:", cleaned);
  }

  const parts = cleaned.split(urlRegex);

  return (
    <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
      {parts.map((part, idx) => {
        if (!part) return null;
        if (/^https?:\/\//i.test(part)) {
          const m = part.match(/^(https?:\/\/[^\s)]+)([.,;:]?)$/i);
          const href = m ? m[1] : part;
          const trail = m && m[2] ? m[2] : "";
          return (
            <React.Fragment key={idx}>
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-words">
                {href}
              </a>
              {trail}
            </React.Fragment>
          );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </span>
  );
};

/* ---------- existing rich block renderer helpers (unchanged but use new linkifier) ---------- */
const renderChildren = (children) => {
  if (!children) return null;
  return children.map((child, index) => {
    if (typeof child === "string") {
      return <span key={index}>{renderTextWithLinks(child)}</span>;
    }
    const style = {};
    const text = child.text || "";

    if (child.bold) style.fontWeight = "bold";
    if (child.underline) style.textDecoration = "underline";
    if (child.italic) style.fontStyle = "italic";

    if (child.type === "link") {
      return (
        <a href={child.link || child.url} key={index} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {child.children ? renderChildren(child.children) : child.text || child.label || child.url}
        </a>
      );
    }

    return (
      <span key={index} style={style}>
        {text || child.label || child.name || ""}
      </span>
    );
  });
};

const TableComponent = ({ children }) => (
  <div className="overflow-x-auto my-4">
    <table className="min-w-full border-collapse border border-gray-300">
      <tbody>
        {children.map((row, index) => (
          <tr key={index} className="border-b border-gray-300">
            {row.children.map((cell, cellIndex) => (
              <td key={cellIndex} className="p-2 border-r border-gray-300">
                {renderChildren(cell.children)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ListItem = ({ item }) => {
  if (!item || item.type !== "list_item") return null;
  const listContent = [];
  const textContent = [];

  item.children?.forEach((child) => {
    if (child.type === "ol_list" || child.type === "ul_list") listContent.push(child);
    else textContent.push(child);
  });

  return (
    <li className="mb-2">
      {textContent.length > 0 && renderChildren(textContent)}
      {listContent.map((list, index) => (
        <ol key={index} className="list-decimal pl-6 mt-2">
          {list.children.map((child, childIndex) => (
            <ListItem key={childIndex} item={child} />
          ))}
        </ol>
      ))}
    </li>
  );
};

const processListItems = (items) => {
  return items.map((item, index) => {
    if (!item) return null;
    if (item.type === "ol_list" || item.type === "ul_list") {
      return (
        <ol key={index} className="list-decimal pl-6 mt-2">
          {processListItems(item.children)}
        </ol>
      );
    }
    if (item.type === "list_item") {
      return (
        <li key={index} className="mb-2">
          {renderChildren(item.children.filter((child) => child.type !== "ol_list" && child.type !== "ul_list"))}
          {item.children
            .filter((child) => child.type === "ol_list" || child.type === "ul_list")
            .map((sublist, subIndex) => (
              <ol key={subIndex} className="list-decimal pl-6 mt-2">
                {processListItems(sublist.children)}
              </ol>
            ))}
        </li>
      );
    }
    return null;
  });
};

const RenderList = ({ list }) => {
  if (!list?.children) return null;
  return <ol className="list-decimal pl-6 my-4 space-y-2">{processListItems(list.children)}</ol>;
};

const AlignJustify = ({ content }) => {
  return content.map((item, index) => {
    switch (item.type) {
      case "ol_list":
        return <RenderList key={index} list={item} />;
      case "paragraph":
        return (
          <p key={index} className="my-2">
            {renderChildren(item.children)}
          </p>
        );
      default:
        return null;
    }
  });
};

const RenderContent = ({ content }) => {
  if (!content) return null;
  return content.map((item, index) => {
    if (!item) return null;
    switch (item.type) {
      case "align_justify":
        return (
          <div key={index} className="space-y-4">
            <AlignJustify content={item.children} />
          </div>
        );
      case "paragraph":
        return (
          <p key={index} className="my-2">
            {renderChildren(item.children)}
          </p>
        );
      case "block_quote":
        return (
          <blockquote key={index} className="border-l-4 border-gray-300 pl-4 my-4">
            {renderChildren(item.children)}
          </blockquote>
        );
      case "ol_list":
        return <RenderList key={index} list={item} />;
      case "ul_list":
        return <RenderList key={index} list={item} />;
      case "table":
        return <TableComponent key={index} children={item.children} />;
      default:
        if (item.children) {
          return (
            <div key={index} className="my-2">
              {renderChildren(item.children)}
            </div>
          );
        }
        return (
          <div key={index} className="my-2">
            {typeof item === "string" ? renderTextWithLinks(item) : <pre className="whitespace-pre-wrap">{JSON.stringify(item)}</pre>}
          </div>
        );
    }
  });
};

/* ---------- generic simple renderers ---------- */

const renderSimpleNameDetails = (item, index) => (
  <div key={index} className="mb-4">
    {item.name && <h4 className="font-semibold text-gray-900">{renderTextWithLinks(item.name)}</h4>}
    {item.details && <p className="text-gray-600 mt-1">{renderTextWithLinks(item.details)}</p>}
    {item.url && (
      <p className="mt-2">
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          Official link
        </a>
      </p>
    )}
  </div>
);

const renderSteps = (items) => {
  return (
    <ol className="list-decimal pl-6 space-y-3">
      {items.map((it, idx) => {
        if (!it) return null;
        if (typeof it === "string") {
          return (
            <li key={idx} className="text-gray-700">
              {renderTextWithLinks(it)}
            </li>
          );
        }
        const label = it.step !== undefined ? `Step ${it.step}` : it.title || null;
        // defensive: sometimes instruction stored under different keys
        const rawInstr = it.instruction || it.instructionText || it.text || it.description || "";
        // extra normalization + fallback pre-render to ensure nothing is hidden
        const cleaned = normalizeDashes(stripInvisible(rawInstr));
        return (
          <li key={idx} className="text-gray-700">
            {label && <span className="font-semibold mr-2">{label}:</span>}
            <span>{renderTextWithLinks(cleaned)}</span>
            {it.url && (
              <div className="mt-1">
                <a href={it.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Apply / More details
                </a>
              </div>
            )}
            {/* fallback pre block (visible if user wants raw text) */}
            {/* <pre className="whitespace-pre-wrap text-xs text-gray-400 mt-2">{rawInstr}</pre> */}
          </li>
        );
      })}
    </ol>
  );
};

/* ---------- main component ---------- */

const DisplayFormatted = ({ contentData, dataType }) => {
  if (!contentData || (Array.isArray(contentData) && contentData.length === 0)) return <div>No data available</div>;

  const looksRich = contentData.some((item) => item && (item.type || (item.children && Array.isArray(item.children))));
  if (looksRich) {
    return (
      <div className="prose max-w-none">
        {contentData.map((item, index) => (
          <RenderContent key={index} content={[item]} />
        ))}
      </div>
    );
  }

  // benefits/documents
  if ((dataType === "benefits" || dataType === "documents") || contentData.every((item) => item && (item.name || item.details))) {
    return <div>{contentData.map((item, idx) => renderSimpleNameDetails(item, idx))}</div>;
  }

  // applicationProcess
  if (dataType === "applicationProcess" || contentData.every((item) => typeof item === "string" || item.step || item.instruction || item.url)) {
    return <div>{renderSteps(contentData)}</div>;
  }

  // faq
  if (contentData.every((it) => it && (it.question || it.answer))) {
    return (
      <div className="space-y-4">
        {contentData.map((faq, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4">
            {faq.question && <h4 className="font-semibold text-gray-900">{renderTextWithLinks(faq.question)}</h4>}
            {faq.answer && <p className="text-gray-600 mt-1">{renderTextWithLinks(faq.answer)}</p>}
          </div>
        ))}
      </div>
    );
  }

  // fallback
  return (
    <div className="prose max-w-none">
      {contentData.map((item, idx) => (
        <div key={idx} className="my-2">
          {typeof item === "string" ? renderTextWithLinks(item) : <pre className="whitespace-pre-wrap">{JSON.stringify(item, null, 2)}</pre>}
        </div>
      ))}
    </div>
  );
};

export default DisplayFormatted;
