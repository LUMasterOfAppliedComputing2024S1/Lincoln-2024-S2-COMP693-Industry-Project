
function toggleFiltering() {
    var x = document.getElementById("filtering-card");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function openGatewayGraph(measureId, GraphLink) {

    const graphUrl = `https://dev-gateway.rpmretail.com/common/classes/charting/Graph.aspx?MeasureFilter=${measureId}&Days=90&${GraphLink}`;
    
    window.open(graphUrl, '_blank', 'status=1,scrollbars=1,menubar=0,resizable=1,toolbar=0,location=0,width=860,height=560');
}

function openToolkitGraph(measureId, GraphLink) {

    const graphUrl = `https://dev-toolkit.rpmretail.com/common/classes/charting/Graph.aspx?MeasureFilter=${measureId}&Days=90&${GraphLink}`;
    
    window.open(graphUrl, '_blank', 'status=1,scrollbars=1,menubar=0,resizable=1,toolbar=0,location=0,width=860,height=560');
}

// Ensure the DOM is fully loaded before executing the script
document.addEventListener('DOMContentLoaded', async function() {
	await fetch('/dbStores')
		.then(response => response.json())
		.then(data => {
			const storesDropdown = document.getElementById('Stores');
			const { storeNames, storeKey } = data;

			const all = document.createElement('option');
			all.value = JSON.stringify({"type":"Store", "key":null});
			all.textContent = "All Stores";
			all.selected = true;
			storesDropdown.appendChild(all);
			// console.log(storeNames);
			storeNames.forEach((name, index) => {
				const option = document.createElement('option');
				option.value = JSON.stringify({"type":"Store", "key":storeKey[index]});
				// option.value = {"type":"Store", "key":storeKey[index]};
				option.textContent = name;
				// console.log(option.value)
				storesDropdown.appendChild(option);
			});
			
		})
		.catch(error => console.error('Error fetching Stores:', error));
});

// Ensure the DOM is fully loaded before executing the script
document.addEventListener('DOMContentLoaded', async function() {
	await fetch('/dbCategories')
		.then(response => response.json())
		.then(data => {
			const categoriesDropdown = document.getElementById('Categories');
			const { categoryNames, categoryKey } = data;

			const all = document.createElement('option');
			all.value = JSON.stringify({"type":"Category", "key":null});
			all.textContent = "All Categories";
			all.selected = true;
			categoriesDropdown.appendChild(all);

			categoryNames.forEach((name, index) => {
				const option = document.createElement('option');
				option.value = JSON.stringify({"type":"Category", "key":categoryKey[index]});
				// option.value = {"type":"Category", "key":categoryKey[index]};
				option.textContent = name;
				// console.log(option.value)
				categoriesDropdown.appendChild(option);
			});

			// console.log(JSON.parse(categoriesDropdown.value))

		})
		.catch(error => console.error('Error fetching categories:', error));
});

// Ensure the DOM is fully loaded before executing the script
document.addEventListener('DOMContentLoaded', async function() {
	await fetch('/dbSuppliers')
		.then(response => response.json())
		.then(data => {
			const suppliersDropdown = document.getElementById('Suppliers');
			const { suppliersNames, supplierKey } = data;

			const all = document.createElement('option');
			all.value = JSON.stringify({"type":"Supplier", "key":null});
			all.textContent = "All Suppliers";
			all.selected = true;
			suppliersDropdown.appendChild(all);

			suppliersNames.forEach((name, index) => {
				const option = document.createElement('option');
				option.value = JSON.stringify({"type":"Supplier", "key":supplierKey[index]});
				// option.value = {"type":"Supplier", "key":supplierKey[index]};
				option.textContent = name;
				// console.log(option.value)
				suppliersDropdown.appendChild(option);
			});

		})
		.catch(error => console.error('Error fetching Suppliers:', error));
});


//Set scoreboard child level interface 
document.addEventListener('DOMContentLoaded', async function() {

        document.getElementById("scoreboardHeading").innerHTML = "Group";

		const storesDropdown = document.getElementById('Stores');
		const categoriesDropdown = document.getElementById('Categories');
		const suppliersDropdown = document.getElementById('Suppliers');

		function resetAndDisableDropdown(dropdown) {
			if (dropdown.options.length > 1) {
				dropdown.selectedIndex = 1;
				dropdown.value = dropdown.options[1].value;
				dropdown.disabled = true;
			}
		}

		function enableDropdowns() {
			storesDropdown.disabled = false;
			categoriesDropdown.disabled = false;
			suppliersDropdown.disabled = false;
		}

		storesDropdown.addEventListener('change', function() {
			if (storesDropdown.value !== null && storesDropdown.selectedIndex !== 0) {
				resetAndDisableDropdown(categoriesDropdown);
				resetAndDisableDropdown(suppliersDropdown);
			} else {
				enableDropdowns();
			}
		});

		categoriesDropdown.addEventListener('change', function() {
			if (categoriesDropdown.value !== null && categoriesDropdown.selectedIndex !== 0) {
				resetAndDisableDropdown(storesDropdown);
				resetAndDisableDropdown(suppliersDropdown);
			} else {
				enableDropdowns();
			}
		});

		suppliersDropdown.addEventListener('change', function() {
			if (suppliersDropdown.value !== null && suppliersDropdown.selectedIndex !== 0) {
				resetAndDisableDropdown(storesDropdown);
				resetAndDisableDropdown(categoriesDropdown);
			} else {
				enableDropdowns();
			}
		});

		const clearButton = document.getElementById('Clear');
		clearButton.addEventListener('click', function() {
	
			if (storesDropdown.options.length > 1) {
				storesDropdown.selectedIndex = 1;
				storesDropdown.value = storesDropdown.options[1].value;
				storesDropdown.disabled = false;
			}

			if (categoriesDropdown.options.length > 1) {
				categoriesDropdown.selectedIndex = 1;
				categoriesDropdown.value = categoriesDropdown.options[1].value;
				categoriesDropdown.disabled = false;
			}			

			if (suppliersDropdown.options.length > 1) {
				suppliersDropdown.selectedIndex = 1;
				suppliersDropdown.value = suppliersDropdown.options[1].value;
				suppliersDropdown.disabled = false;
			}    		
		});
});


// Function to show spinner
function showSpinner() {
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'block';
}

// Function to hide spinner
function hideSpinner() {
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'none';
}


document.getElementById('filterForm').addEventListener('submit', async function (event) {
    // Prevent form submission initially
    event.preventDefault();
	showSpinner();

	await Promise.all([
        fetch('/dbStores').then(response => response.json()),
        fetch('/dbCategories').then(response => response.json()),
        fetch('/dbSuppliers').then(response => response.json())
    ])
    .then(([storeData, categoryData, supplierData]) => {
        const stores = storeData.storeKey;
        const categorys = categoryData.categoryKey;
        const suppliers = supplierData.supplierKey;
		const storesNames = storeData.storeNames;
        const categorysNames = categoryData.categoryNames;
        const suppliersNames = supplierData.suppliersNames;

    // Get selected dropdown values
    const selectedStoreValue = document.getElementById('Stores').value;
    const selectedCategoryValue = document.getElementById('Categories').value;
    const selectedSupplierValue = document.getElementById('Suppliers').value;

	const selectedStore  = JSON.parse(selectedStoreValue);
	const selectedCategory  = JSON.parse(selectedCategoryValue);
	const selectedSupplier  = JSON.parse(selectedSupplierValue);

	const selectedStoreKey = selectedStore.key
	const selectedCategoryKey = selectedCategory.key
	const selectedSupplierKey = selectedSupplier.key

	const selectedStoreName = selectedStore.type
	const selectedCategoryName = selectedCategory.type
	const selectedSupplierName = selectedSupplier.type

	let storeHeading;
	if (selectedStoreName === 'Store' && selectedStoreKey === null) {
		storeHeading = "";
	} else {
	const storeIndex = stores.indexOf(selectedStoreKey);
	storeHeading = " - "+storesNames[storeIndex]; }
	
	let categoryHeading;
	if (selectedCategoryName === 'Category' && selectedCategoryKey === null) {
		categoryHeading = "";
	} else {
	const categoryIndex = categorys.indexOf(selectedCategoryKey);
	categoryHeading = " - "+categorysNames[categoryIndex]; }

	let supplierHeading;
	if (selectedSupplierName === 'Supplier' && selectedSupplierKey === null) {
		supplierHeading = "";
	} else {
		const supplierIndex = suppliers.indexOf(selectedSupplierKey);
		supplierHeading = " - "+suppliersNames[supplierIndex];	}

	// console.log("selectedStoreKey:",selectedStoreKey)
	// console.log("selectedCategoryKey:",selectedCategoryKey)
	// console.log("selectedSupplierKey:",selectedSupplierKey)
	let childKey, ChildLevel;
	if (selectedStoreKey !== null) {
		ChildLevel = "Store";
		childKey = selectedStoreKey;
	} else if (selectedCategoryKey !== null) {
		ChildLevel = "Category";
		childKey = selectedCategoryKey;
	} else if (selectedSupplierKey !== null) {
		ChildLevel = "Supplier";
		childKey = selectedSupplierKey;
	} else {
		ChildLevel = "Store";
		childKey = null;
	};
	
	let parentLevel = null;
	let parentKey = null;

	// console.log("ChildLevel:", scoreboardInterfaceValue)
	// console.log("childKey:", childKey)
	// console.log("parentLevel:", parentLevel)
	// console.log("parentKey:", parentKey)

	document.getElementById('ChildLevel').value = ChildLevel;
	document.getElementById('childKey').value = childKey;
	document.getElementById('parentLevel').value = parentLevel;
	document.getElementById('parentKey').value = parentKey;
	
	fetch('/processScoreboard', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			ChildLevel: ChildLevel,
			ChildKey: childKey,
			ParentLevel: parentLevel,
			ParentKey: parentKey
		})
	})
	.then(response => response.json())
	.then(data => {
		if (data.success) {
			toggleFiltering()
			Toastify({
				text: "Scoreboard updated successfully!",
				duration: 800,
				close: true,
				gravity: "top",
				position: "center",
				backgroundColor: "#4CAF50",
				stopOnFocus: true
			}).showToast();

			// console.log('Processed Data:',data)

			document.getElementById('results').innerHTML = JSON.stringify(data.data.results, null, 2);
			document.getElementById('kpiDate').innerText = data.data.kpiDate;
			document.getElementById('subscription').innerText = data.data.subscription.GroupName;
			document.getElementById('store-heading').innerText = data.data.storeHeading;
			document.getElementById('category-heading').innerText = data.data.categoryHeading;
			document.getElementById('supplier-heading').innerText = data.data.supplierHeading;
			document.getElementById('ShowWizard').innerText = data.data.ShowWizard;
			document.getElementById('IsGroup').innerText = data.data.IsGroup;
			document.getElementById('ObjectOne').innerText = data.data.ObjectOne;
			document.getElementById('ObjectMany').innerText = data.data.ObjectMany;
			document.getElementById('GraphLink').innerText = data.data.GraphLink;


			// Populate data into the performance section
			const results = data.data.results;
			const last25DaysDateResults = data.data.last25DaysDateResults;
			const subscription = data.data.subscription.GroupName;
			const kpiDate = data.data.kpiDate;
			const ObjectMany = data.data.ObjectMany;
			const IsGroup = data.data.IsGroup;
			const ObjectOne = data.data.ObjectOne;
			const ShowWizard = data.data.ShowWizard;
			const GraphLink = data.data.GraphLink;
	
			let scoreboardHeading;
			if (ChildLevel === "Store" && childKey === null) {
				scoreboardHeading = "Group";
			} else if (ChildLevel === "Store" && childKey !== null) {
				scoreboardHeading = "";
			} else if (ChildLevel === "Category") {
				scoreboardHeading = "";
			} else if (ChildLevel === "Supplier") {
				scoreboardHeading = "";
			} else {
				scoreboardHeading = "Group";
			}
			
			scoreboardHeading = document.getElementById("scoreboardHeading").innerHTML = scoreboardHeading;

			// Update the text content of store-heading, category-heading, and supplier-heading
			document.getElementById('store-heading').textContent = selectedStoreName;
			document.getElementById('category-heading').textContent = selectedCategoryName;
			document.getElementById('supplier-heading').textContent = selectedSupplierName;

			const headingDiv = document.getElementById('heading');
			headingDiv.innerHTML = `
					<div class="top-left"  id="heading">
						<h1><span id="scoreboardHeading"></span>${scoreboardHeading} Scoreboard <span id="store-heading">${storeHeading}</span><span id="category-heading">${categoryHeading}</span><span id="supplier-heading">${supplierHeading}</span></h1>
						<p id="kpiDate">For the last 30 days to ${kpiDate}</p>
						<p id="subscription">${subscription}</p>
					</div>
				`;

			const performanceDiv = document.getElementById('performance');
			performanceDiv.innerHTML = '';

			if (IsGroup) {
				performanceDiv.innerHTML = `
					<div class="card performance text-center" id="${results.IndexIndicator[0]}VsBenchmark">
						<h6 style="font-weight: 900; font-size: 110%; margin: 5%;">From <br><span style="font-weight: 900; font-size: 300%;">${results.TotalObjects[0]}</span> <br>${ObjectMany}</h6>						
					</div>
				`;
			} else {
				const performanceId = `${results.IndexIndicator[0]}VsBenchmark`;

				performanceDiv.innerHTML = `
					<div class="card performance text-center" id="${performanceId}">
						<h6 style="font-weight: 300; font-size: 110%; margin: 5%;">${results.MeasureDescription[0]}  <br><span style="color: black; font-weight: 900; font-size: 300%;">${results.Rank[0]}</span> <br>of ${results.TotalObjects[0]} ${ObjectMany}</h6>
					</div>
				`;
			}
			
			//sidebar
			const sideBarDiv = document.getElementById('sidebar');
			sideBarDiv.innerHTML = '';

			if (IsGroup) {
				sideBarDiv.innerHTML = `
					                            <ul class="nav flex-column card bg-light">
                                <li class="nav-item">
                                    <canvas id="totalSalesChart" style="width:95%;max-width:300px"></canvas>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link d-flex justify-content-center" href="#" style="font-weight: bold; margin: 2%;">
                                        Top Categories
                                    </a>
                                    
                                    <div class="d-flex justify-content-between" style="margin: 0; padding: 0;">
                                        <p style="margin: 0; padding-left: 5%;">1. Coughs & Colds</p>
                                        <span style="margin: 0; padding-right: 5%; font-weight: 900;">15%</span>
                                    </div>
                                    <div class="d-flex justify-content-between" style="margin: 0; padding: 0;">
                                        <p style="margin: 0; padding-left: 5%;">2. Health Supplements</p>
                                        <span style="margin: 0; padding-right: 5%; font-weight: 900;">12%</span>
                                    </div>
                                    <div class="d-flex justify-content-between" style="margin: 0; padding: 0;">
                                        <p style="margin: 0; padding-left: 5%;">3. Skin Care</p>
                                        <span style="margin: 0; padding-right: 5%; font-weight: 900;">11%</span>
                                    </div>
                                </li>
                                <li class="nav-item">
                                    <canvas id="totalStockChart" style="width:95%;max-width:300px"></canvas>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link d-flex justify-content-center" href="#" style=" font-weight: bold; margin: 2%;">
                                        <span style="color: red; font-size: x-large; font-weight: 900;">36% </span> &nbsp; Dead Stock
                                    </a>
                                </li>
                            </ul>
				`
				initializeTotalSalesChart()
				initializeTotalStockChart()
				;
			} else if (!IsGroup && ChildLevel === 'Store') {
				sideBarDiv.innerHTML = `					                            <ul class="nav flex-column card bg-light">
                                <li class="nav-item">
                                    <canvas id="totalSalesChart" style="width:92%;max-width:300px"></canvas>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link d-flex justify-content-center" href="#" style="font-weight: bold; margin: 0 auto;">
                                        Top Categories
                                    </a>
                                    
                                    <div class="d-flex justify-content-between" style="margin: 0; padding: 0;">
                                        <p style="margin: 0; padding-left: 5%;">1. Coughs & Colds</p>
                                        <span style="margin: 0; padding-right: 5%; font-weight: 900;">15%</span>
                                    </div>
                                    <div class="d-flex justify-content-between" style="margin: 0; padding: 0;">
                                        <p style="margin: 0; padding-left: 5%;">2. Health Supplements</p>
                                        <span style="margin: 0; padding-right: 5%; font-weight: 900;">12%</span>
                                    </div>
                                    <div class="d-flex justify-content-between" style="margin: 0; padding: 0;">
                                        <p style="margin: 0; padding-left: 5%;">3. Skin Care</p>
                                        <span style="margin: 0; padding-right: 5%; font-weight: 900;">11%</span>
                                    </div>
                                </li>
								<li class="nav-item">
                                    <a class="nav-link d-flex justify-content-center" href="#" style="font-weight: bold; margin: 0 auto;">
                                        Top Products
                                    </a>
                                    
                                    <div class="d-flex justify-content-between" style="margin: 0; padding: 0;">
                                        <p style="margin: 0; padding-left: 5%;">1. Truck Licence Medical </p>
                                    </div>
                                    <div class="d-flex justify-content-between" style="margin: 0; padding: 0;">
                                        <p style="margin: 0; padding-left: 5%;">2. Sleep Test</p>
                                    </div>
                                    <div class="d-flex justify-content-between" style="margin: 0; padding: 0;">
                                        <p style="margin: 0; padding-left: 5%;">3. CODRAL DAY/NIGHT…</p>
                                    </div>
                                </li>
                                <li class="nav-item">
                                    <canvas id="totalStockChart" style="width:92%;max-width:300px"></canvas>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link d-flex justify-content-center" href="#" style=" font-weight: bold; margin: 2%;">
                                        <span style="color: red; font-size: x-large; font-weight: 900;">36% </span> &nbsp; Dead Stock
                                    </a>
                                </li>
                            </ul>
				`
				initializeTotalSalesChart()
				initializeTotalStockChart()
			} else if (!IsGroup && ChildLevel === 'Category') {
				sideBarDiv.innerHTML = `					                            <ul class="nav flex-column card bg-light">
                                <li class="nav-item">
                                    <canvas id="totalSalesChart" style="width:95%;max-width:300px"></canvas>
                                </li>
								<li class="nav-item">
                                    <a class="nav-link d-flex justify-content-center" href="#" style="font-weight: bold; margin: 2%;">
                                        Top Suppliers
                                    </a>
                                    
                                    <div class="d-flex justify-content-center" style="margin: 0; padding: 0;">
                                        <p style="margin: 0; ">1. Radiant Health </p>
                                    </div>
                                    <div class="d-flex justify-content-center" style="margin: 0; padding: 0;">
                                        <p style="margin: 0; ">2. Kenvue</p>
                                    </div>
                                    <div class="d-flex justify-content-center" style="margin: 0; padding: 0;">
                                        <p style="margin: 0; ">3. Harker Herbals NZ </p>
                                    </div>
                                </li><br><br>
                                <li class="nav-item">
                                    <canvas id="totalStockChart" style="width:95%;max-width:300px"></canvas>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link d-flex justify-content-center" href="#" style=" font-weight: bold; margin: 2%;">
                                        <span style="color: red; font-size: x-large; font-weight: 900;">36% </span> &nbsp; Dead Stock
                                    </a>
                                </li>
                            </ul>
				`
				initializeTotalSalesChart()
				initializeTotalStockChart()
			} else if (!IsGroup && ChildLevel === 'Supplier') {
				sideBarDiv.innerHTML = `					                            <ul class="nav flex-column card bg-light">
                                <li class="nav-item">
                                    <canvas id="totalSalesChart" style="width:95%;max-width:300px"></canvas>
                                </li>
								<li class="nav-item">
                                    <a class="nav-link d-flex justify-content-center" href="#" style="font-weight: bold; margin: 2%;">
                                        Top Products
                                    </a>
                                    
                                    <div class="d-flex justify-content-between" style="margin: 0; padding: 0;">
                                        <p style="margin: 0; padding-left: 20%;">1. DURO TUSS CHESTY FO..</p>
                                    </div>
                                    <div class="d-flex justify-content-between" style="margin: 0; padding: 0;">
                                        <p style="margin: 0; padding-left: 20%;">2.  *DEMAZIN PSE COLD…</p>
                                    </div>
                                    <div class="d-flex justify-content-between" style="margin: 0; padding: 0;">
                                        <p style="margin: 0; padding-left: 20%;">3. DUROTUSS HRBLS DRY..</p>
                                    </div>
                                </li>
                                <li class="nav-item">
                                    <canvas id="totalStockChart" style="width:95%;max-width:300px"></canvas>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link d-flex justify-content-center" href="#" style=" font-weight: bold; margin: 2%;">
                                        <span style="color: red; font-size: x-large; font-weight: 900;">36% </span> &nbsp; Dead Stock
                                    </a>
                                </li>
                            </ul>
				`
				initializeTotalSalesChart()
				initializeTotalStockChart()
			}

			// Populate data into the KPI section
			const kpiContainer = document.getElementById('kpi-container');
			kpiContainer.innerHTML = '';

			if (results.rsResults.length > 1) {
				let row = document.createElement('div');
				row.classList.add('row', 'g-3');
				kpiContainer.appendChild(row);

				results.rsResults.forEach((kpi, index) => {
					if (index > 0) {
						if (index % 3 === 1) {
							row = document.createElement('div');
							row.classList.add('row', 'g-4');
							kpiContainer.appendChild(row);
						}

						const col = document.createElement('div');
						col.classList.add('col-12', 'col-md-4');

						const card = document.createElement('div');
						card.classList.add('card', 'kpi');
						card.id = `${results.IndexIndicator[index]}VsBenchmark`;
						card.style = "height: auto;"

						const cardHeader = document.createElement('div');
						cardHeader.classList.add('kpi-heading');
						cardHeader.innerHTML = `
							<a href="javascript:void(0)" id="${results.MeasureDescription[index]}" title="View the definition and calculation for ${results.MeasureDescription[index]}" onclick="openDefinition('${results.MeasureDescription[index]}')">${results.MeasureDescription[index]} </a>
						`;

						const cardBody = document.createElement('div');
						cardBody.classList.add('card-body', 'kpi-details', 'd-flex', 'flex-column', 'justify-content-center');

						const measureValue = results.MeasureValue[index] !== null && results.MeasureValue[index] !== '' ? results.MeasureValue[index] : '-';

						const bestValue = results.Best[index] !== null && results.Best[index] !== '' 
							? results.Best[index] 
							: '-';

						const worstValue = results.Worst[index] !== null && results.Worst[index] !== '' 
						? results.Worst[index] 
						: '-';

						cardBody.innerHTML = `
							<div class="container" >
								<p>
									${measureValue}
								</p>
							</div>
							<div class="container-sm kpi-item-container">
								${IsGroup ? '' : `
									<div class="kpi-item">
										<h6>Group Average:</h6>
										<span>${results.ParentMeasure ? results.ParentMeasure[index] : '-'}</span>
									</div>							
								`}
								${IsGroup ? `
									<div class="kpi-item">
										<h6>Top Result:</h6>
										<span>${bestValue}</span>
									</div>
								`:`
									<div class="kpi-item">
										<h6>Top Result:</h6>
										<span>${bestValue}</span>
									</div>
								</div>`
								}
								${IsGroup ? `							
									<div class="kpi-item">
										<h6>Bottom Result:</h6>
										<span>${worstValue}</span>
									</div>						
							</div>` : ''}
						`;

						// Add the comparison section for last 25 days
						const compareContainer = document.createElement('div');
						compareContainer.classList.add('container-sm', 'kpi-item-container');

						const measureId = results.MeasureID[index];
						const graphUrl = `https://dev-gateway.rpmretail.com/common/classes/charting/Graph.aspx?MeasureFilter=${measureId}&Days=90&${GraphLink}`;

						let comparisonHTML = `<img src="hyphen.png" alt="hyphen" class="card-img-bottom" id="hyphen" onclick="open('${graphUrl}', '_blank', 'status=1,scrollbars=1,menubar=0,resizable=1,toolbar=0,location=0,width=860,height=560')">`;

						// Parse the percentage strings into numbers by removing the '%','$' and converting to a float
						function parseMeasureValue(value) {
							if (typeof value === 'string') {
								if (value.includes('%')) {
									return parseFloat(value.replace('%', ''));
								}

								if (value.includes('$')) {
									return parseFloat(value.replace('$', ''));
								}
							}
							return parseFloat(value);
						}

						const lastValue = parseMeasureValue(last25DaysDateResults.MeasureValue[index]);
						const currentValue = parseMeasureValue(results.MeasureValue[index]);

						console.log("lastResult:", last25DaysDateResults.MeasureValue[index]);
						console.log("Result:", results.MeasureValue[index]);

						if (!isNaN(lastValue) && !isNaN(currentValue)) { 
							if (lastValue > currentValue && last25DaysDateResults.MeasureDescription[index] === 'Dead Stock %' ) {
								comparisonHTML = `<img src="gooddown.png" alt="gooddown" class="card-img-bottom" style="width: 30px; height: 30px; cursor:pointer;" onclick="open('${graphUrl}', '_blank', 'status=1,scrollbars=1,menubar=0,resizable=1,toolbar=0,location=0,width=860,height=560')">`;
							} else if (lastValue < currentValue && last25DaysDateResults.MeasureDescription[index] === 'Dead Stock %' ) {
								comparisonHTML = `<img src="badup.png" alt="badup" class="card-img-bottom" style="width: 30px; height: 30px; cursor:pointer;" onclick="open('${graphUrl}', '_blank', 'status=1,scrollbars=1,menubar=0,resizable=1,toolbar=0,location=0,width=860,height=560')">`;
							} else if (lastValue > currentValue && last25DaysDateResults.MeasureDescription[index] === 'Low Stock %') {
								comparisonHTML = `<img src="gooddown.png" alt="gooddown" class="card-img-bottom" style="width: 30px; height: 30px; cursor:pointer;" onclick="open('${graphUrl}', '_blank', 'status=1,scrollbars=1,menubar=0,resizable=1,toolbar=0,location=0,width=860,height=560')">`;
							} else if (lastValue < currentValue && last25DaysDateResults.MeasureDescription[index] === 'Low Stock %') {
								comparisonHTML = `<img src="badup.png" alt="badup" class="card-img-bottom" style="width: 30px; height: 30px; cursor:pointer;" onclick="open('${graphUrl}', '_blank', 'status=1,scrollbars=1,menubar=0,resizable=1,toolbar=0,location=0,width=860,height=560')">`;
							} else if (lastValue > currentValue) {
								comparisonHTML = `<img src="baddown.png" alt="baddown" class="card-img-bottom" style="width: 30px; height: 30px; cursor:pointer;" onclick="open('${graphUrl}', '_blank', 'status=1,scrollbars=1,menubar=0,resizable=1,toolbar=0,location=0,width=860,height=560')">`;
							} else if (lastValue < currentValue) {
								comparisonHTML = `<img src="good.png" alt="good" class="card-img-bottom" style="width: 30px; height: 30px; cursor:pointer;" onclick="open('${graphUrl}', '_blank', 'status=1,scrollbars=1,menubar=0,resizable=1,toolbar=0,location=0,width=860,height=560')">`;
							} else {
								comparisonHTML = `
									<img src="left.png" alt="left" class="card-img-bottom" style="margin-right: 5%; width: 30px; height: 30px; cursor:pointer;">
									<img src="right.png" alt="right" class="card-img-bottom" style="width: 30px; height: 30px; cursor:pointer;" onclick="open('${graphUrl}', '_blank', 'status=1,scrollbars=1,menubar=0,resizable=1,toolbar=0,location=0,width=860,height=560')">
								`;
							}
						}
						compareContainer.innerHTML = `${IsGroup ? `
							<div class="kpi-item container-sm kpi-item-container" style="justify-content: center; margin-bottom: 15px;">
								${comparisonHTML}
							</div>
						` : `
							<div class="kpi-item container-sm kpi-item-container" style="justify-content: center; margin-bottom: 10px; width:93%;">
								<div class="kpi-item">
									<h3 style="margin-right: 10px;"><strong>${results.Rank[index]}</strong></h3>
								</div>
								<br>
								<div class="kpi-item">
									<p style="margin-right: 50px;">of ${results.TotalObjects[0]} ${ObjectMany}</p>
								</div>
								${comparisonHTML}
							</div>
						`}`;

						// const img = document.createElement('img');
						// img.src = 'thumbnail.png';
						// img.alt = 'thumbnail';
						// img.style.cursor = 'pointer';
						// img.classList.add('card-img-bottom');
						// img.id = `graph${index}`; 

						// const measureId = results.MeasureID[index];
						// const graphUrl = `https://dev-gateway.rpmretail.com/common/classes/charting/Graph.aspx?MeasureFilter=${measureId}&Days=90&${GraphLink}`;
						// img.setAttribute('onclick', `open('${graphUrl}', '_blank', 'status=1,scrollbars=1,menubar=0,resizable=1,toolbar=0,location=0,width=860,height=560')`);

						const cardFooter = document.createElement('div');
						cardFooter.classList.add('bg-transparent', 'kpi-fix', 'd-flex', 'justify-content-center', 'align-items-center', 'ScoreboardHidden');
						const showFixButton = ShowWizard && [
							"Gross Margin %",
							"Low Stock %",
							"Dead Stock %",
							"Products Per Customer",
							"Average Product Price",
							"Sales Growth",
							"Average Sale"
						].includes(results.MeasureDescription[index]);

						cardFooter.innerHTML = `${ShowWizard ? `
							<div class="d-grid gap-2 col-9 mx-auto ScoreboardHidden" >
								<button type="button" class="btn ${showFixButton ? 'btn-light' : 'btn-secondary'} ScoreboardHidden" ${showFixButton ? '' : 'disabled'} id="fixButton${index}" style="margin-bottom:5%;">
									${showFixButton ?
									`<i class="bi bi-wrench-adjustable" style="color: blue;"></i> <strong style="color: blue;">Fix</strong>`:`<i class="bi bi-wrench-adjustable"></i> <strong>Fix</strong>`}
								</button>
							</div>
						`: '' }`;

						card.appendChild(cardHeader);
						card.appendChild(cardBody);
						card.appendChild(compareContainer);
						card.appendChild(cardFooter);

						col.appendChild(card);
						row.appendChild(col);

						if (showFixButton) {
							document.getElementById(`fixButton${index}`).addEventListener('click', function() {
								const childKey = data.data.childKey;
								const measureGroup = results.MeasureGroup[index];
								const url = `https://dev-gateway.rpmretail.com/Application/Resources/Wizards/ImprovementWizards/${measureGroup}/Step01.asp?Store=${childKey}&NumOfFilter=10`;
								
								window.open(url, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
							});
						}

						const logoContainer = document.getElementById('logo');
						logoContainer.innerHTML = '';

						if (ChildLevel === 'Store') {
							const logo = document.createElement('div');
							logo.classList.add('container');
							logo.style = 'margin: 1%;';
						
							logo.innerHTML = `
								<div class="row g-3">
									<div class="col-12 d-flex justify-content-end align-items-center">
										<img style="vertical-align:middle; border:0px solid #000000; width: 40%; height: 80%;" src="logo.png">
									</div>
								</div>`;

							logoContainer.appendChild(logo);
						} else if (ChildLevel === 'Store' && childKey !== null) {
							const logo = document.createElement('div');
							logo.classList.add('container');
							logo.style = 'margin: 1%; margin-bottom:3%';
						
							logo.innerHTML = `
								<div class="row g-3">
									<div class="col-12 d-flex justify-content-end align-items-center">
										<img style="vertical-align:middle; border:0px solid #000000; width: 40%; height: 80%;" src="logo.png">
									</div>
								</div>`;

							logoContainer.appendChild(logo);
						} else if (ChildLevel !== 'Store' && results.rsResults.length>7) {
							const logo = document.createElement('div');
							logo.classList.add('container');
							logo.style = 'margin-top: 1%;';

							logo.innerHTML = `
									<div class="row g-3">
										<div class="col-12 d-flex justify-content-end align-items-center">
											<img style="vertical-align:middle; border:0px solid #000000; width: 40%; height: 80%;" src="logo.png">
										</div>
								</div>`;

								logoContainer.appendChild(logo);
						} else if (ChildLevel !== 'Store' && results.rsResults.length<=7)  {
							const logo = document.createElement('div');
							logo.classList.add('container');
							logo.style = 'margin-top: 20%;';

							logo.innerHTML = `
									<div class="row g-3">
										<div class="col-12 d-flex justify-content-end align-items-center">
											<img style="vertical-align:middle; border:0px solid #000000; width: 40%; height: 80%;" src="logo.png">
										</div>
								</div>`;

								logoContainer.appendChild(logo);
						}

												
						hideSpinner();

					}
				});
			}
			} else {
				Toastify({
					text: "Failed to update the scoreboard. Please try again.",
					duration: 1000,
					close: true,
					gravity: "top",
					position: "right",
					backgroundColor: "#f44336",
					stopOnFocus: true
				}).showToast();
				hideSpinner();
				alert('Failed to update data. Please try again.');
			}
		})
		.catch(error => {
			Toastify({
				text: "Failed to update the scoreboard. Please try again.",
				duration: 3000,
				close: true,
				gravity: "top",
				position: "right",
				backgroundColor: "#f44336",
				stopOnFocus: true
			}).showToast();
			hideSpinner();
			console.error('Error submitting form:', error);
			alert('An error occurred while processing your request.');
		});
	})
	.catch(error => {
		hideSpinner();
	console.error('Error fetching dropdown data:', error);
	});
});


// Variables to manage the state
let currentPage = 1;
const pageSizeSelector = document.getElementById('page-size');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const kpiContainer = document.getElementById('kpi-container');

// Get all KPI cards
const allKpiCards = Array.from(kpiContainer.getElementsByClassName('col-12'));

// Function to render KPIs according to the selected page size
function renderKpis() {
    const pageSize = pageSizeSelector.value === 'all' ? allKpiCards.length : parseInt(pageSizeSelector.value, 10);
    const totalPages = Math.ceil(allKpiCards.length / pageSize);

    prevPageButton.style.display = pageSize === allKpiCards.length ? 'none' : 'inline-block';
    nextPageButton.style.display = pageSize === allKpiCards.length ? 'none' : 'inline-block';

    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;

    allKpiCards.forEach((card) => card.style.display = 'none');

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, allKpiCards.length);

    for (let i = startIndex; i < endIndex; i++) {
        allKpiCards[i].style.display = 'block';
    }
}

pageSizeSelector.addEventListener('change', () => {
    currentPage = 1;
    renderKpis();
});

prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderKpis();
    }
});

nextPageButton.addEventListener('click', () => {
    const pageSize = pageSizeSelector.value === 'all' ? allKpiCards.length : parseInt(pageSizeSelector.value, 10);
    const totalPages = Math.ceil(allKpiCards.length / pageSize);

    if (currentPage < totalPages) {
        currentPage++;
        renderKpis();
        document.querySelector('.kpi-container').scrollTop = 0;
    }
});

// Initial render
renderKpis();




// <!-- Modal -->
const myModal = document.getElementById('myModal')
const myInput = document.getElementById('myInput')

myModal.addEventListener('shown.bs.modal', () => {
  myInput.focus()
})