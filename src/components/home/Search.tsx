import React, { useState } from "react";

const Search = () => {
    const [searchTerm, setSearchTerm] = useState("");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSearch = (event: any) => {
        setSearchTerm(event.target.value);
    };

    return (
        <>
            <div className="pt-3"></div>
            <div className="container">
                <div className="card">
                    <div className="card-body p-3">
                        <div className="form-group mb-0">
                            <input
                                type="text"
                                id="elementsSearchInput"
                                placeholder="Cari Pelanggan..."
                                className="form-control"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Search;
