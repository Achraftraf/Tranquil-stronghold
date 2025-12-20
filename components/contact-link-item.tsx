import React from 'react';

interface Props {
    title: string,
    icon: React.ReactElement<{ className?: string }>,
    content: string,
    href: string,
}

const ContactLinkItem: React.FC<Props> = ({ title, icon, content, href }) => {
  return (
    <div className="bg-white border border-gray-200 py-4 px-6 hover:shadow-sm transition-all"> 
        <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    {icon && React.cloneElement(icon, { className: 'w-6 h-6 text-blue-600' })}
                </span>
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
            </div>
            <div> 
               <a
                href={href} 
                className="text-gray-600 hover:text-blue-700 text-sm transition-colors"
                >
                    {content}
                </a>
            </div>
        </div>
    </div>
  )
}

export default ContactLinkItem;