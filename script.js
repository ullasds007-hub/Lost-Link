import {
    db,
    auth,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc,
    signOut,
    onAuthStateChanged
} from "./firebase.js";// ==========================
// AUTH NAVBAR
// ==========================

const authLink =
    document.getElementById("authLink");

if (authLink) {

    onAuthStateChanged(
        auth,
        function (user) {

            if (user) {

                authLink.textContent =
                    user.email + " | Logout";

                authLink.href = "#";

                authLink.addEventListener(
                    "click",
                    async function (event) {

                        event.preventDefault();

                        await signOut(auth);

                        window.location.href =
                            "index.html";
                    },
                    { once: true }
                );

            } else {

                authLink.textContent =
                    "Login";

                authLink.href =
                    "login.html";
            }
        }
    );
}
// ==========================
// HOMEPAGE BUTTONS
// ==========================

const homeButtons = document.querySelectorAll(".hero-buttons button");

if (homeButtons.length >= 2) {
    homeButtons[0].addEventListener("click", function () {
        window.location.href = "lost.html";
    });

    homeButtons[1].addEventListener("click", function () {
        window.location.href = "found.html";
    });
}


// ==========================
// LOST ITEM FORM
// ==========================

const lostForm = document.getElementById("lostForm");

if (lostForm) {
        lostForm.addEventListener("submit",  function (event) {
        event.preventDefault();

        const report = {
            type: "Lost",
            itemName: document.getElementById("itemName").value,
            category: document.getElementById("category").value,
            description: document.getElementById("description").value,
            location: document.getElementById("location").value,
            date: document.getElementById("date").value,
            time: document.getElementById("time").value
        };
        console.log("Starting Firestore write...");
        
        addDoc(
            collection(db, "lostReports"),
            report
        )
        .then(function () {
            console.log("Lost report saved to Firestore!");
        })
        .catch(function (error) {
            console.error("Firestore error:", error);
        });

        let reports =
            JSON.parse(localStorage.getItem("lostReports")) || [];

        reports.push(report);

        localStorage.setItem(
            "lostReports",
            JSON.stringify(reports)
        );

        alert("Lost item reported successfully!");

        lostForm.reset();
    });
}


// ==========================
// FOUND ITEM FORM
// ==========================

const foundForm = document.getElementById("foundForm");

if (foundForm) {
    foundForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const report = {
            type: "Found",
            itemName: document.getElementById("foundItemName").value,
            category: document.getElementById("foundCategory").value,
            description: document.getElementById("foundDescription").value,
            location: document.getElementById("foundLocation").value,
            date: document.getElementById("foundDate").value,
            time: document.getElementById("foundTime").value,
            status: "FOUND"
        };
        addDoc(
            collection(db, "foundReports"),
            report
        )
        .then(function () {
            console.log("Found report saved to Firestore!");
        })
        .catch(function (error) {
            console.error("Firestore error:", error);
        });

        let reports =
            JSON.parse(localStorage.getItem("foundReports")) || [];

        reports.push(report);

        localStorage.setItem(
            "foundReports",
            JSON.stringify(reports)
        );

        alert("Found item reported successfully!");

        foundForm.reset();
    });
}


// ==========================
// BROWSE PAGE
// ==========================


const reportContainer =
    document.getElementById("reportContainer");

if (reportContainer) {

    async function loadReports() {
        console.log("Browse loadReports started");

        try {

            // Get Lost reports from Firestore
            const lostSnapshot =
                await getDocs(
                    collection(db, "lostReports")
                );

            const lostReports =
                lostSnapshot.docs.map(function (document) {

                    return {
                        id: document.id,
                        ...document.data()
                    };

                });


            // Get Found reports from Firestore
            const foundSnapshot =
                await getDocs(
                    collection(db, "foundReports")
                );

            const foundReports =
                foundSnapshot.docs.map(function (document) {

                    return {
                        id: document.id,
                        ...document.data()
                    };

                });


            // Combine Lost + Found reports
            const reports =
                lostReports.concat(foundReports);
                console.log("Lost reports:", lostReports);
                console.log("Found reports:", foundReports);
                console.log("Total reports:", reports);


            // Clear old cards
            reportContainer.innerHTML = "";


            // If no reports exist
            if (reports.length === 0) {

                const message =
                    document.createElement("p");

                message.textContent =
                    "No reports available yet.";

                reportContainer.appendChild(message);

                return;
            }


            // Create report cards
            reports.forEach(function (report) {

                const card =
                    document.createElement("div");

                card.classList.add("card");

                card.style.cursor =
                    "pointer";


                // Add Found card style
                if (report.type === "Found") {

                    card.classList.add(
                        "found-card"
                    );

                }


                // Used for filter
                card.dataset.type =
                    report.type.toLowerCase();


                // Used for search
                card.dataset.search =
                    (
                        (report.itemName || "") + " " +
                        (report.category || "") + " " +
                        (report.location || "") + " " +
                        (report.description || "")
                    ).toLowerCase();


                // Open item details
                card.addEventListener(
                    "click",
                    function () {

                        localStorage.setItem(
                            "selectedReport",
                            JSON.stringify(report)
                        );

                        window.location.href =
                            "item.html";

                    }
                );


                // Item icon
                const icon =
                    document.createElement("div");

                icon.classList.add(
                    "item-icon"
                );

                icon.textContent = "📦";


                // Item name
                const title =
                    document.createElement("h3");

                title.textContent =
                    report.itemName;


                // Category
                const category =
                    document.createElement("p");

                category.textContent =
                    "📂 " + report.category;


                // Location
                const location =
                    document.createElement("p");

                location.textContent =
                    "📍 " + report.location;


                // Date
                const date =
                    document.createElement("p");

                date.textContent =
                    "📅 " + report.date;


                // Description
                const description =
                    document.createElement("p");

                description.textContent =
                    report.description;


                // Status
                const status =
                    document.createElement("span");


                if (
                    report.status === "RETURNED"
                ) {

                    status.textContent =
                        "RETURNED";

                    status.style.backgroundColor =
                        "#dcfce7";

                    status.style.color =
                        "#166534";

                }

                else {

                    status.textContent =
                        report.type.toUpperCase();

                }


                // Add everything to card
                card.appendChild(icon);
                card.appendChild(title);
                card.appendChild(category);
                card.appendChild(location);
                card.appendChild(date);
                card.appendChild(description);
                card.appendChild(status);


                // Add card to Browse page
                reportContainer.appendChild(
                    card
                );

            });


            // =====================================
            // SEARCH AND FILTER
            // =====================================

            const searchInput =
                document.getElementById(
                    "searchInput"
                );

            const allFilter =
                document.getElementById(
                    "allFilter"
                );

            const lostFilter =
                document.getElementById(
                    "lostFilter"
                );

            const foundFilter =
                document.getElementById(
                    "foundFilter"
                );


            let currentFilter = "all";


            function filterReports() {

                const cards =
                    reportContainer.querySelectorAll(
                        ".card"
                    );


                let searchText = "";

                if (searchInput) {

                    searchText =
                        searchInput.value
                            .toLowerCase()
                            .trim();

                }


                cards.forEach(
                    function (card) {

                        const matchesSearch =
                            card.dataset.search.includes(
                                searchText
                            );


                        const matchesType =
                            currentFilter === "all" ||
                            card.dataset.type ===
                                currentFilter;


                        if (
                            matchesSearch &&
                            matchesType
                        ) {

                            card.style.display = "";

                        }

                        else {

                            card.style.display =
                                "none";

                        }

                    }
                );

            }


            // Search box
            if (searchInput) {

                searchInput.addEventListener(
                    "input",
                    filterReports
                );

            }


            // All button
            if (allFilter) {

                allFilter.addEventListener(
                    "click",
                    function () {

                        currentFilter = "all";

                        filterReports();

                    }
                );

            }


            // Lost button
            if (lostFilter) {

                lostFilter.addEventListener(
                    "click",
                    function () {

                        currentFilter = "lost";

                        filterReports();

                    }
                );

            }


            // Found button
            if (foundFilter) {

                foundFilter.addEventListener(
                    "click",
                    function () {

                        currentFilter = "found";

                        filterReports();

                    }
                );

            }

        }

        catch (error) {

            console.error(
                "Error loading reports from Firestore:",
                error
            );

            reportContainer.innerHTML =
                "<p>Unable to load reports.</p>";

        }

    }


    // Start loading reports
    loadReports();

}


// ==========================
// SEARCH + FILTER TOGETHER
// ==========================

const searchInput =
    document.getElementById("searchInput");

const allFilter =
    document.getElementById("allFilter");

const lostFilter =
    document.getElementById("lostFilter");

const foundFilter =
    document.getElementById("foundFilter");

let activeFilter = "all";


function updateReports() {

    const searchText =
        searchInput
            ? searchInput.value.toLowerCase()
            : "";

    const cards =
        document.querySelectorAll("#reportContainer .card");


    cards.forEach(function (card) {

        const cardText =
            card.textContent.toLowerCase();

        const matchesSearch =
            cardText.includes(searchText);

        let matchesFilter = false;


        if (activeFilter === "all") {

            matchesFilter = true;

        } else {

            matchesFilter =
                cardText.includes(activeFilter);
        }


        if (matchesSearch && matchesFilter) {

            card.style.display = "block";

        } else {

            card.style.display = "none";
        }
    });
}


if (searchInput) {
    searchInput.addEventListener("input", function () {
        updateReports();
    });
}


if (allFilter) {
    allFilter.addEventListener("click", function () {
        activeFilter = "all";
        updateReports();
    });
}


if (lostFilter) {
    lostFilter.addEventListener("click", function () {
        activeFilter = "lost";
        updateReports();
    });
}


if (foundFilter) {
    foundFilter.addEventListener("click", function () {
        activeFilter = "found";
        updateReports();
    });
}


// ==========================
// ITEM DETAILS PAGE
// ==========================

const detailName =
    document.getElementById("detailName");

if (detailName) {

    const selectedReport =
        JSON.parse(localStorage.getItem("selectedReport"));

    if (selectedReport) {

        detailName.textContent =
            selectedReport.itemName;

        document.getElementById("detailCategory").textContent =
            "📂 Category: " + selectedReport.category;

        document.getElementById("detailLocation").textContent =
            "📍 Location: " + selectedReport.location;

        document.getElementById("detailDate").textContent =
            "📅 Date: " + selectedReport.date;

        document.getElementById("detailTime").textContent =
            "🕐 Time: " + selectedReport.time;

        document.getElementById("detailDescription").textContent =
            "📝 Description: " + selectedReport.description;


        const detailStatus =
            document.getElementById("detailStatus");


        if (selectedReport.status === "RETURNED") {

            detailStatus.textContent =
                "RETURNED";

            detailStatus.style.backgroundColor =
                "#dcfce7";

            detailStatus.style.color =
                "#166534";

        } else {

            detailStatus.textContent =
                selectedReport.type.toUpperCase();


            if (selectedReport.type === "Found") {

                detailStatus.style.backgroundColor =
                    "#dcfce7";

                detailStatus.style.color =
                    "#166534";
            }
        }
    }
}


// ==========================
// BACK BUTTON
// ==========================

const backButton =
    document.getElementById("backButton");

if (backButton) {

    backButton.addEventListener("click", function () {

        window.location.href =
            "browse.html";
    });
}


// ==========================
// CLAIM BUTTON + FORM
// ==========================

const claimButton =
    document.getElementById("claimButton");

const claimFormBox =
    document.getElementById("claimFormBox");

const claimForm =
    document.getElementById("claimForm");

const currentReport =
    JSON.parse(localStorage.getItem("selectedReport"));


if (claimButton && currentReport) {

    if (
        currentReport.type === "Found" &&
        currentReport.status !== "RETURNED"
    ) {

        claimButton.style.display =
            "inline-block";

    } else {

        claimButton.style.display =
            "none";
    }
}


if (claimButton && claimFormBox) {

    claimButton.addEventListener("click", function () {

        claimFormBox.style.display =
            "block";

        claimButton.style.display =
            "none";
    });
}


if (claimForm) {

    claimForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const selectedReport =
            JSON.parse(localStorage.getItem("selectedReport"));


        if (selectedReport.status === "RETURNED") {

            alert(
                "This item has already been returned."
            );

            return;
        }


        const claim = {

            name:
                document.getElementById("claimName").value,

            message:
                document.getElementById("claimMessage").value,

            itemName:
                selectedReport.itemName,

            itemType:
                selectedReport.type,

            category:
                selectedReport.category,

            location:
                selectedReport.location,

            date:
                selectedReport.date,

            status:
                "PENDING"
        };

        console.log("Starting claim Firestore write...");

        addDoc(
            collection(db, "claims"),
            claim
        )
        .then(function () {
            console.log("Claim saved to Firestore!");
        })
        .catch(function (error) {
            console.error("Claim Firestore error:", error);
        });
        let claims =
            JSON.parse(localStorage.getItem("claims")) || [];

        claims.push(claim);


        localStorage.setItem(
            "claims",
            JSON.stringify(claims)
        );


        alert(
            "Claim submitted successfully!"
        );


        claimForm.reset();

        claimFormBox.style.display =
            "none";

        claimButton.style.display =
            "inline-block";
    });
}


// ==========================================
// CLAIMS PAGE
// ==========================================

const claimsContainer =
    document.getElementById("claimsContainer");

if (claimsContainer) {

    async function loadClaims() {

        try {

            // Get claims from Firestore
            const claimsSnapshot =
                await getDocs(
                    collection(db, "claims")
                );

            const claims =
                claimsSnapshot.docs.map(function (document) {

                    return {
                        id: document.id,
                        ...document.data()
                    };

                });


            claimsContainer.innerHTML = "";


            // No claims
            if (claims.length === 0) {

                const message =
                    document.createElement("p");

                message.textContent =
                    "No claims submitted yet.";

                claimsContainer.appendChild(message);

                return;
            }


            // Display claims
            claims.forEach(function (claim) {

                const card =
                    document.createElement("div");

                card.classList.add("card");


                // ITEM NAME
                const title =
                    document.createElement("h3");

                title.textContent =
                    claim.itemName || "Unknown Item";


                // CLAIMANT
                const claimant =
                    document.createElement("p");

                claimant.textContent =
                    "👤 Claimed by: " +
                    (claim.name || "Unknown");


                // CATEGORY
                const category =
                    document.createElement("p");

                category.textContent =
                    "📂 Category: " +
                    (claim.category || "Not available");


                // LOCATION
                const location =
                    document.createElement("p");

                location.textContent =
                    "📍 Location: " +
                    (claim.location || "Not available");


                // DATE
                const date =
                    document.createElement("p");

                date.textContent =
                    "🗓️ Date: " +
                    (claim.date || "Not available");


                // REASON
                const reason =
                    document.createElement("p");

                reason.textContent =
                    "💬 Reason: " +
                    (claim.message || "Not available");


                // STATUS
                const status =
                    document.createElement("span");

                status.textContent =
                    claim.status || "PENDING";

                status.classList.add(
                    "claim-status"
                );


                function updateStatusColor() {

                    status.classList.remove(
                        "claim-pending",
                        "claim-accepted",
                        "claim-rejected"
                    );


                    if (
                        status.textContent ===
                        "ACCEPTED"
                    ) {

                        status.classList.add(
                            "claim-accepted"
                        );

                    }

                    else if (
                        status.textContent ===
                        "REJECTED"
                    ) {

                        status.classList.add(
                            "claim-rejected"
                        );

                    }

                    else {

                        status.classList.add(
                            "claim-pending"
                        );

                    }

                }


                updateStatusColor();


                // ACCEPT BUTTON
                const acceptButton =
                    document.createElement(
                        "button"
                    );

                acceptButton.textContent =
                    "Accept";


                // REJECT BUTTON
                const rejectButton =
                    document.createElement(
                        "button"
                    );

                rejectButton.textContent =
                    "Reject";


                // Hide buttons if claim already completed
                if (
                    claim.status === "ACCEPTED" ||
                    claim.status === "REJECTED"
                ) {

                    acceptButton.style.display =
                        "none";

                    rejectButton.style.display =
                        "none";

                }


                // ==================================
                // ACCEPT CLAIM
                // ==================================

                acceptButton.addEventListener(
                    "click",
                    async function () {

                        try {

                            // Accept this claim
                            await updateDoc(
                                doc(
                                    db,
                                    "claims",
                                    claim.id
                                ),
                                {
                                    status:
                                        "ACCEPTED"
                                }
                            );


                            // Find matching Found item
                            const foundSnapshot =
                                await getDocs(
                                    collection(
                                        db,
                                        "foundReports"
                                    )
                                );


                            for (
                                const foundDocument
                                of foundSnapshot.docs
                            ) {

                                const foundReport =
                                    foundDocument.data();


                                if (
                                    foundReport.itemName ===
                                        claim.itemName &&
                                    foundReport.location ===
                                        claim.location &&
                                    foundReport.date ===
                                        claim.date
                                ) {

                                    await updateDoc(
                                        doc(
                                            db,
                                            "foundReports",
                                            foundDocument.id
                                        ),
                                        {
                                            status:
                                                "RETURNED"
                                        }
                                    );

                                }

                            }


                            // Reject other pending claims
                            const allClaimsSnapshot =
                                await getDocs(
                                    collection(
                                        db,
                                        "claims"
                                    )
                                );


                            for (
                                const claimDocument
                                of allClaimsSnapshot.docs
                            ) {

                                const otherClaim =
                                    claimDocument.data();


                                if (
                                    claimDocument.id !==
                                        claim.id &&
                                    otherClaim.itemName ===
                                        claim.itemName &&
                                    otherClaim.location ===
                                        claim.location &&
                                    otherClaim.date ===
                                        claim.date &&
                                    (
                                        otherClaim.status ===
                                            "PENDING" ||
                                        !otherClaim.status
                                    )
                                ) {

                                    await updateDoc(
                                        doc(
                                            db,
                                            "claims",
                                            claimDocument.id
                                        ),
                                        {
                                            status:
                                                "REJECTED"
                                        }
                                    );

                                }

                            }


                            alert(
                                "Claim accepted. Item marked as returned."
                            );

                            window.location.reload();

                        }

                        catch (error) {

                            console.error(
                                "Accept claim error:",
                                error
                            );

                            alert(
                                "Unable to accept claim."
                            );

                        }

                    }
                );


                // ==================================
                // REJECT CLAIM
                // ==================================

                rejectButton.addEventListener(
                    "click",
                    async function () {

                        try {

                            await updateDoc(
                                doc(
                                    db,
                                    "claims",
                                    claim.id
                                ),
                                {
                                    status:
                                        "REJECTED"
                                }
                            );


                            alert(
                                "Claim rejected."
                            );

                            window.location.reload();

                        }

                        catch (error) {

                            console.error(
                                "Reject claim error:",
                                error
                            );

                            alert(
                                "Unable to reject claim."
                            );

                        }

                    }
                );


                // Add content to card
                card.appendChild(title);
                card.appendChild(claimant);
                card.appendChild(category);
                card.appendChild(location);
                card.appendChild(date);
                card.appendChild(reason);
                card.appendChild(status);
                card.appendChild(acceptButton);
                card.appendChild(rejectButton);


                claimsContainer.appendChild(card);

            });

        }

        catch (error) {

            console.error(
                "Error loading claims:",
                error
            );

            claimsContainer.innerHTML =
                "<p>Unable to load claims.</p>";

        }

    }


    loadClaims();

}


// ==========================
// CLEAR TEST DATA
// ==========================

const clearDataButton =
    document.getElementById("clearDataButton");

if (clearDataButton) {

    clearDataButton.addEventListener(
        "click",
        function () {

            const confirmClear =
                confirm(
                    "Are you sure you want to delete all test data?"
                );


            if (confirmClear) {

                localStorage.removeItem(
                    "lostReports"
                );

                localStorage.removeItem(
                    "foundReports"
                );

                localStorage.removeItem(
                    "selectedReport"
                );

                localStorage.removeItem(
                    "claims"
                );


                alert(
                    "All test data cleared!"
                );


                window.location.reload();
            }
        }
    );
}