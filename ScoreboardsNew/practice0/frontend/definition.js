//Definition
function openDefinition(measureDescription) {
	// Create a new pop-up window
	const popup = window.open("", "popupWindow", "status=0,scrollbars=1,menubar=0,resizable=0,toolbar=0,location=0,width=700,height=410");

	// Define content based on measureDescription
	let content = "";
	if (measureDescription === "Gross Margin %") {
		content = `
			<div id="ReportHeader">
				<p id="ReportTitle">Gross Margin %</p>
			</div>
			<div id="ResourceContent" style="font-size: 10pt;">
				<table id="ReportMenu" style="width:auto">
					<tr>
						<td class="ReportMenuHeading">
							Definition
						</td>
					</tr>
					<tr>
						<td class="ReportMenuList">
							<p>Gross Margin % is the difference between Sales $<span style="font-size: 8pt; vertical-align: top;">*</span> and the Cost of Goods Sold,
							expressed as a percentage of Sales $<span style="font-size: 8pt; vertical-align: top;">*</span>.</p>
						</td>
					</tr>
					<tr>
						<td class="ReportMenuHeading">
							Calculation
						</td>
					</tr>
					<tr>
						<td class="ReportMenuList">
							<p>
								(30 Day Sales $<span style="font-size: 8pt; vertical-align: top;">*</span> - Cost
								of Goods Sold) / 30
								Day Sales $<span style="font-size: 8pt; vertical-align: top;">*</span>
							</p>
							<br />
							<p>
								e.g. ($120,000 - $60,000) / $120,000 = 50%.
							</p>
							<br />
							<p style="font-size: 8pt; font-style: italic;">
								<span style="font-size: 8pt; vertical-align: top;">*</span> Sales $ are exclusive
								of GST.
							</p>
						</td>
					</tr>
				</table>
			</div>
		`;
	} else if (measureDescription === "Sales Growth") {
		content = `	<div id="ReportHeader">
		<p id="ReportTitle">Sales Growth</p>
	</div>
	<div id="ResourceContent" style="font-size: 10pt;">
		<table id="ReportMenu" style="width:auto">
			<tr>
				<td class="ReportMenuHeading">
					Definition
				</td>
			</tr>
			<tr>
				<td class="ReportMenuList">
					<p>Sales $<span style="font-size: 8pt; vertical-align: top;">*</span> for the past 30 days compared to the same 30 days last year.</p>
				</td>
			</tr>
			<tr>
				<td class="ReportMenuHeading">
					Calculation
				</td>
			</tr>
			<tr>
				<td class="ReportMenuList">
						<p>
							(30 Day Sales $<span style="font-size: 8pt; vertical-align: top;">*</span> / Trading
							Days in past 30 days<span style="font-size: 8pt; vertical-align: top;">**</span>)
							/ (30 Day Sales $ LY<span style="font-size: 8pt; vertical-align: top;">*</span> /
							Trading Days in same 30 days LY<span style="font-size: 8pt; vertical-align: top;">**</span>)</p>
						<br />
						<p>
							e.g. ($150,000 / 25) / ($120,000 / 22) = +10%</p>
						<br />
						<p style="font-size: 8pt; font-style: italic;">
							<span style="font-size: 8pt; vertical-align: top;">*</span> Sales $ are exclusive
							of GST.
						</p>
						<p style="font-size: 8pt; font-style: italic;">
							<span style="font-size: 8pt; vertical-align: top;">**</span> When the sales figure
							is an aggregate from more than one store then trading days is an aggregate of the days where trading occurred from those same stores.</p>
				</td>
			</tr>
		</table>
	</div>
`;
	} else if (measureDescription === "Dead Stock %") {
		content = `	<div id="ReportHeader">
		<p id="ReportTitle">Dead Stock %</p>
	</div>
	<div id="ResourceContent" style="font-size: 10pt;">
		<table id="ReportMenu" style="width:auto">
			<tr>
				<td class="ReportMenuHeading">
					Definition
				</td>
			</tr>
			<tr>
				<td class="ReportMenuList">
					<p>Dead Stock % is the proportion of the total stock in your business which has not
						sold. Once a product is flagged as being dead
						it remains dead.  The dead flag will only be removed once additional stock of two or more
						units has been receipted or stock has completely sold out.   </p>
				</td>
			</tr>
			<tr>
				<td class="ReportMenuHeading">
					Calculation
				</td>
			</tr>
			<tr>
				<td class="ReportMenuList">
						<p>
							Dead Stock on Hand $ / Stock on Hand $</p>
						<br />
						<p>
							e.g. $20,000 / $60,000 = 33%.</p>
				</td>
			</tr>
		</table>
	</div>
`;
	} else if (measureDescription === "Average Sale") {
		content = `	<div id="ReportHeader">
		<p id="ReportTitle">Average Sale</p>
	</div>
	<div id="ResourceContent" style="font-size: 10pt;">
		<table id="ReportMenu" style="width:auto">
			<tr>
				<td class="ReportMenuHeading">
					Definition
				</td>
			</tr>
			<tr>
				<td class="ReportMenuList">
					<p>The Average value spent by each retail customer.</p>
				</td>
			</tr>
			<tr>
				<td class="ReportMenuHeading">
					Calculation
				</td>
			</tr>
			<tr>
				<td class="ReportMenuList">
						<p>
							Total Sales $<span style="font-size: 8pt; vertical-align: top;">*</span> for the past 30 days / Total number of customer transactions</p>
						<br />
						<p>
							e.g. Total sales are $2500 / Total Customer transactions are 100<br/>
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Average Sale = $25.00
						</p>
						<br />
						<br />
						<p style="font-size: 8pt; font-style: italic;">
							<span style="font-size: 8pt; vertical-align: top;">*</span> Sales are inclusive of GST</p>
				</td>
			</tr>
		</table>
	</div>
`;
	} else if (measureDescription === "Products Per Customer") {
		content = `	<div id="ReportHeader">
		<p id="ReportTitle">Products Per Customer</p>
	</div>
	<div id="ResourceContent" style="font-size: 10pt;">
		<table id="ReportMenu" style="width:auto">
			<tr>
				<td class="ReportMenuHeading">
					Definition
				</td>
			</tr>
			<tr>
				<td class="ReportMenuList">
					<p>The number of different products purchased in the average customer transaction.</p>
				</td>
			</tr>
			<tr>
				<td class="ReportMenuHeading">
					Calculation
				</td>
			</tr>
			<tr>
				<td class="ReportMenuList">
						<p>
							Sum of different products in  transactions<span style="font-size: 8pt; vertical-align: top;">*</span> /  Sum of customers<span style="font-size: 8pt; vertical-align: top;">*</span>.</p>
						<br />
						<p>
							e.g. (Customer1 buys 2 products) + (Customer2 buys 1 product) + (Customer3 buys 1 product) + (Customer4 buys 3 products)<br/>
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = 7 products / 4 customer transactions<br/>
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = 1.75 Products per Customer
						</p>
						<br />
						<p>
							Note: Selling 2 or more of the same product to a customer (in the same transaction) only counts as 1 product.
						</p>
						<br/>
						<p style="font-size: 8pt; font-style: italic;">
							<span style="font-size: 8pt; vertical-align: top;">*</span> Based on the past 30 days.</p>
				</td>
			</tr>
		</table>
	</div>
`;
	} else if (measureDescription === "Average Product Price") {
		content = `	<div id="ReportHeader">
		<p id="ReportTitle">Average Product Price</p>
	</div>
	<div id="ResourceContent" style="font-size: 10pt;">
		<table id="ReportMenu" style="width:auto">
			<tr>
				<td class="ReportMenuHeading">
					Definition
				</td>
			</tr>
			<tr>
				<td class="ReportMenuList">
					<p>Average Product Price is the average price of the different products sold in the average customer transaction.</p>
				</td>
			</tr>
			<tr>
				<td class="ReportMenuHeading">
					Calculation
				</td>
			</tr>
			<tr>
				<td class="ReportMenuList">
						<p>
							Total Sales $<span style="font-size: 8pt; vertical-align: top;">*</span> of Product A for the past 30 days / number of transactions (where Product A was sold)</p>
						<br />
						<p>
							e.g. Product A sales are $150 / Product A features in 10 transactions<br/>
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Average Product Price = $15.00
						</p>
						<br />
						<p>
							Note: If a transaction includes multiples of the same product, the Average Product Price is increased.<br/>
							<br/>
							e.g. if a customer buys 3 units of product A @ $15.00 each, the Average Product Price is $45.00
						</p>
						<br />
						<p style="font-size: 8pt; font-style: italic;">
							<span style="font-size: 8pt; vertical-align: top;">*</span> Sales are inclusive of GST</p>
				</td>
			</tr>
		</table>
	</div>
`;
	} else if (measureDescription === "Low Stock %") {
		content = `	<div id="ReportHeader">
		<p id="ReportTitle">Under Stocked %</p>
	</div>
	<div id="ResourceContent" style="font-size: 10pt;">
		<table id="ReportMenu" style="width:auto">
			<tr>
				<td class="ReportMenuHeading">
					Definition
				</td>
			</tr>
			<tr>
				<td class="ReportMenuList">
					<p>The value of additional stock required to bring all products up to at least 30 days cover.</p>
				</td>
			</tr>
			<tr>
				<td class="ReportMenuHeading">
					Calculation
				</td>
			</tr>
			<tr>
				<td class="ReportMenuList">
						<p>
							Optimal Order Value / Cost of Goods Sold</p>
						<br />
						<p>
							e.g. $15,000 / $60,000 = 25%.</p>
				</td>
			</tr>
		</table>
	</div>
`;
	} else {
		content = `<h1>${measureDescription}</h1><p>No specific content is available for this measure.</p>`;
	}

	// Write the content into the pop-up window
	popup.document.write(`
		<html>
		<head>
		<title>${measureDescription}</title>
		<style>
				#ReportHeader{
					text-align			: left;
					
					margin-left			: 10px;
					margin-right			: 10px;
					margin-top			: 0px; 
					margin-bottom			: 0px; 
				}
				#ReportTitle {
					margin-left			: 0px;
					margin-right			: 0px;
					margin-top			: 0px; 
					margin-bottom			: 5px;
					
					font-size			: 16pt;
					font-weight			: bold;
					font-style			: normal;
					
					color				: #000000; 
				}
				#ResourceContent {
					margin-left			: 0px;
					margin-right			: 0px;
					margin-top			: 0px; 
					margin-bottom			: 0px; 
					padding-left			: 15px;
					padding-right			: 15px;
					padding-top			: 10px; 
					padding-bottom			: 5px; 
					text-align			: left;
				}
				#ReportMenu{
					float				: center;
					width				: 98%;
					margin-top			: 0px;
				}
				#ReportMenu p{
					padding-bottom			: 5px;
					
					font-size			: 10pt;
				}
				#ReportMenu a{
					font-size			: 10pt;
				}
				#ReportMenu .ReportMenuHeading {
					padding-top			: 20px;
					padding-bottom			: 7px;
					
					font-style			: normal;
					font-size			: 12pt;
					text-align			: left;
					vertical-align			: middle;
					font-weight			: bold;
					border-bottom			: solid 1px #999999;
				}
				#ReportMenu .ReportMenuList {
					width				: 50%;
					padding-top			: 10px;
					padding-right			: 10px;
				}
			</style>
		</head>
		<body>
			${content}
		</body>
		</html>
	`);
	popup.document.close(); // Close the document to finish rendering
}
