 

import { useState } from "react";
import TemplatesOffcanvas from "./TemplatesOffcanvas";

const Templates = () => {
	const [show, setShow] = useState(false);
	const handleToggle = () => setShow(!show);
	return (
		<>
			<button
        onClick={handleToggle}
				className="btn btn-warning btn-others-items-preview shadow"
				type="button"
				data-bs-toggle="offcanvas"
				data-bs-target="#othersTemplate"
				aria-controls="othersTemplate"
			>
				View Others Templates
			</button>
      <TemplatesOffcanvas show={show} handleToggle={handleToggle} />
		</>
	);
};

export default Templates;
