import { Button } from "antd";

import { FaSave } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

//  component for displaying cancel and save buttons on Model antd components
const ModalFooter = (props) => {
  return (
    <>
      <div className="flex  justify-end space-x-2 pr-0 mt-2">
        <Button
          onClick={props.onCancel}
          style={{
            fontWeight: "bold",
            display: "flex items-center justify-center space-x-5",
          }}
        >
          {" "}
          <span className="flex">
            {" "}
            <h2 className=" flex  items-center justify-center ">
              <IoCloseSharp className="  mr-2" />
              Cancel
            </h2>
          </span>{" "}
        </Button>
        <Button
          //   onClick={props.onOk}
          htmlType="submit"
          style={{
            background: "#1D6F2B",
            color: "#FFFFFF",
            fontWeight: "bold",
            display: "flex items-center justify-center space-x-5",
          }}
        >
          {" "}
          <h2 className=" flex  items-center justify-center ">
            <FaSave className="  mr-2" />
            Submit
          </h2>
        </Button>
      </div>
    </>
  );
};

export default ModalFooter;
