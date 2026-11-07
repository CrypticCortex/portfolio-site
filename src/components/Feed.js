// A viewfinder frame: corner brackets plus a label in each top corner, like a camera feed on a monitor.
export default function Feed({ label, right, className = '', children }) {
  return (
    <div className={`feed ${className}`}>
      <span className="feed__c feed__c--tl" aria-hidden="true" /><span className="feed__c feed__c--tr" aria-hidden="true" />
      <span className="feed__c feed__c--bl" aria-hidden="true" /><span className="feed__c feed__c--br" aria-hidden="true" />
      {label && <span className="feed__label">{label}</span>}
      {right && <span className="feed__right">{right}</span>}
      {children}
    </div>
  );
}
