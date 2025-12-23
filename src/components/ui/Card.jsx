const Card = ({ title, children, action }) => (
  <div className="bg-white rounded-md shadow-light border border-gray-4 overflow-hidden hover:shadow-base transition-shadow duration-300">
    {(title || action) && (
      <div className="px-lg py-md border-b border-gray-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-xs sm:gap-md bg-white">
        {title && <h3 className="text-section text-text-primary">{title}</h3>}
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    )}
    <div className="p-lg">{children}</div>
  </div>
);

export default Card;
