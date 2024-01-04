import {
  MdOutlineCallMissedOutgoing,
  MdOutlineCallMissed,
} from "react-icons/md";

const Activity = ({ activity }) => {
  return (
    <div>
      {activity.call_type === "missed" ? (
        activity.direction === "outbound" ? (
          <MdOutlineCallMissedOutgoing />
        ) : (
          <MdOutlineCallMissed />
        )
      ) : (
        <div></div>
      )}
    </div>
  );
};
export default Activity;
