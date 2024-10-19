const path = require('path');
const fs = require('fs');
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MSSQLStore = require('connect-mssql-v2');
const { connect1, connect2,sql, config1, config2 } = require('./db/db');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: 'https://dev-scoreboard.rpmretail.com',
    methods: 'GET,POST,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
};

app.use(cors(corsOptions));

app.use(cookieParser());

// const path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));

// Set EJS as the templating engine
// app.use(express.static(path.join(__dirname, 'frontend')));

app.set('view engine', 'ejs');
app.use(express.json());
app.set('views', path.join(__dirname, 'frontend'));

// Connect to the database
connect1();
connect2();

// Set up session middleware
app.use(session({
    secret: 'rpmuser2024',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

// Render the GATEWAY group scoreboard page based on user's subscription
app.get('/', async (req,res) => {
    
    const SelectedDataSource = req.query.DS;
    const CurrentDate = req.query.CurrentDate;
    const CurrentDateDisplay = req.query.CurrentDateDisplay;

    let currentdate = new Date(CurrentDate);
    currentdate.setDate(currentdate.getDate() - 25);
    let last25DaysDate = currentdate.toISOString().split('T')[0];

    console.log("last25DaysDate:",last25DaysDate)
    req.session.SelectedDataSource = SelectedDataSource;
    req.session.CurrentDate = CurrentDate;
    req.session.CurrentDateDisplay = CurrentDateDisplay;
    req.session.last25DaysDate = last25DaysDate;

    // Function to execute the stored procedure and fetch results
    async function fetchGatewayScoreboard() {
        try {
            const result = await sql.query`EXEC _GetObjectsScoreboard @UserSubscription=${SelectedDataSource},@ParentLevel=null,@ParentKey=null, @ChildLevel= "Store", @ChildKey = null, @Date=${CurrentDate}`;

            const rsResults = result.recordset;
            // console.log(rsResults)
            if (rsResults.length > 0 && rsResults[0].IndexIndicator !== "") {
                let MeasureKey = [],
                    MeasureID = [],
                    MeasureDescription = [],
                    MeasureName = [],
                    MeasureGroup = [],
                    PerspectiveName = [],
                    Format = [],
                    Precision = [],
                    Rank = [],
                    ParentMeasure = [],
                    MeasureValue = [],
                    MeasureIndicator = [],
                    IndexIndicator = [],
                    Best = [],
                    Worst = [],
                    TotalObjects = [];    

                rsResults.forEach((row, index) => {
                    MeasureKey[index] = row.MeasureKey || "";
                    MeasureID[index] = row.MeasureID || "";
                    MeasureDescription[index] = row.MeasureDescription || "";
                    MeasureName[index] = row.MeasureName || "";
                    MeasureGroup[index] = row.MeasureGroup || "";
                    PerspectiveName[index] = row.PerspectiveName || "";
                    Format[index] = row.Format || "Number";
                    Precision[index] = row.Precision || "0";
                    TotalObjects[index] = row.WorstRank || "-";

                    MeasureValue[index] = formatNumericOutput(row.MeasureValue, Format[index], Precision[index]) || "-";
                    ParentMeasure[index] = formatNumericOutput(row.ParentMeasure, Format[index], Precision[index]) || "-";
                    Best[index] = formatNumericOutput(row.BestMeasureValue, Format[index], Precision[index]) || "-";
                    Worst[index] = formatNumericOutput(row.WorstMeasureValue, Format[index], Precision[index]) || "-";
                    Rank[index] = nth(row.Ranking) || "-";

                    IndexIndicator[index] = scoreboardIndicator(row.IndexIndicator);
                    MeasureIndicator[index] = scoreboardIndicator(row.MeasureIndicator);
                });
                

                return {
                    rsResults,
                    MeasureKey,
                    MeasureID,
                    MeasureDescription,
                    MeasureName,
                    MeasureGroup,
                    PerspectiveName,
                    Format,
                    Precision,
                    Rank,
                    ParentMeasure,
                    MeasureValue,
                    MeasureIndicator,
                    IndexIndicator,
                    Best,
                    Worst,
                    TotalObjects
                };

            }

            return null;

        } catch (error) {
            console.error("Database error:", error);
        }
    }

    // Helper functions
    function formatNumericOutput(number, format, precision) {
        let output = number;
    
        if (number == null || number === "") {
            output = "";
        } else {
            format = format.toUpperCase();
            switch (format) {
                case "NUMBER":
                    output = Number(number).toFixed(precision);
                    break;
                case "CURRENCY":
                    output = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: precision }).format(number);
                    break;
                case "PERCENT":
                    output = (Number(number) * 100).toFixed(precision) + '%';
                    break;
                case "TEXT":
                    output = number;
                    break;
                default:
                    output = "";
                    break;
            }
        }
        return output;
    }

    function nth(rank) {
        if (!rank) return null;
        const suffix = ["th", "st", "nd", "rd"];
        const v = rank % 100;
        return rank + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
    }

    function scoreboardIndicator(value) {
        let indicatorOutput;
                
        if (value === null || value === "") {
            indicatorOutput = "Not";
        } else {
            switch (value) {
                case "1":
                    indicatorOutput = "Good";
                    break;
                case "-1":
                    indicatorOutput = "Bad";
                    break;
                case "0":
                    indicatorOutput = "Average";
                    break;
                default:
                    indicatorOutput = "Not";
                    break;
            }
        }
    
        return indicatorOutput;
    }
    
    const subResult = await sql.query`EXEC _GetSubscriptionObjectDetails @UserSubscription=${SelectedDataSource}`;
    const subscription = subResult.recordset[0]
    const kpiDate = CurrentDateDisplay
    const ClientGroup = subResult.recordset[0].GroupName

    const storeHeading = "All"
    const categoryHeading = "All"
    const supplierHeading = "All"

    function ObjectTypeVariables (ObjectType) {
        let ShowWizard, IsGroup, ObjectOne, ObjectMany, GraphLink;

        switch (ObjectType) {
            case "Store":
                ShowWizard = true;
                IsGroup = false;
                ObjectOne = "Store";
                ObjectMany = "Stores";
                GraphLink = `StoreFilter=${encodeURIComponent(childKey)}&Subscription=${encodeURIComponent(SelectedDataSource)}&Date=${encodeURIComponent(CurrentDate)}&Viewing=${encodeURIComponent(ClientGroup)}&Group=${encodeURIComponent(ClientGroup)}&IsCluster=0`;
                break;

            case "StoreCluster":
                ShowWizard = false;
                IsGroup = true;
                ObjectOne = "Store";
                ObjectMany = "Stores";
                GraphLink = `FlipObjects=true&RangeFilter=-2&Subscription=${encodeURIComponent(SelectedDataSource)}&Date=${encodeURIComponent(CurrentDate)}&Viewing=${encodeURIComponent(ClientGroup)}&Group=${encodeURIComponent(ClientGroup)}`;
                break;

            case "GroupStore":
                ShowWizard = false;
                IsGroup = true;
                ObjectOne = "Store";
                ObjectMany = "Stores";
                GraphLink = `Subscription=${encodeURIComponent(SelectedDataSource)}&Date=${encodeURIComponent(CurrentDate)}&Viewing=Stores&HideAverage=true&GroupStores=true&Group=${encodeURIComponent(ClientGroup)}`;
                break;

            case "Category":
                ShowWizard = false;
                IsGroup = false;
                ObjectOne = "Category";
                ObjectMany = "Categories";
                GraphLink = `CategoryFilter=${encodeURIComponent(childKey)}&Subscription=${encodeURIComponent(SelectedDataSource)}&Date=${encodeURIComponent(CurrentDate)}&Viewing=${encodeURIComponent(ClientGroup)}&Group=${encodeURIComponent(ClientGroup)}&IsCluster=0`;
                break;

            case "GroupCategory":
                ShowWizard = false;
                IsGroup = true;
                ObjectOne = "Category";
                ObjectMany = "Categories";
                GraphLink = `Subscription=${encodeURIComponent(SelectedDataSource)}&Date=${encodeURIComponent(CurrentDate)}&Viewing=Categories&HideAverage=true&Group=${encodeURIComponent(ClientGroup)}`;
                break;

            case "Supplier":
                ShowWizard = false;
                IsGroup = false;
                ObjectOne = "Supplier";
                ObjectMany = "Suppliers";
                GraphLink = `SupplierFilter=${encodeURIComponent(childKey)}&Subscription=${encodeURIComponent(SelectedDataSource)}&Date=${encodeURIComponent(CurrentDate)}&Viewing=${encodeURIComponent(ClientGroup)}&Group=${encodeURIComponent(ClientGroup)}&IsCluster=0`;
                break;

            case "GroupSupplier":
                ShowWizard = false;
                IsGroup = true;
                ObjectOne = "Supplier";
                ObjectMany = "Suppliers";
                GraphLink = `Subscription=${encodeURIComponent(SelectedDataSource)}&Date=${encodeURIComponent(CurrentDate)}&Viewing=Suppliers&HideAverage=true&Group=${encodeURIComponent(ClientGroup)}`;
                break;

            default:
                ShowWizard = false;
                IsGroup = true;
                ObjectOne = "Store";
                ObjectMany = "Stores";
                GraphLink = `Subscription=${encodeURIComponent(SelectedDataSource)}&Date=${encodeURIComponent(CurrentDate)}&Viewing=${encodeURIComponent(ClientGroup)}`;
                break;
        }
    return {ShowWizard,IsGroup,ObjectOne,ObjectMany,GraphLink}
}
    let ObjectVariables = ObjectTypeVariables('GroupStore');

    async function fetchlast25DaysScoreboard() {
        try {
            const result = await sql.query`EXEC _GetObjectsScoreboard @UserSubscription=${SelectedDataSource},@ParentLevel=null,@ParentKey=null, @ChildLevel= "Store", @ChildKey = null, @Date=${last25DaysDate}`;

            const last25DaysDateResults = result.recordset;
            // console.log(rsResults)
            if (last25DaysDateResults.length > 0 && last25DaysDateResults[0].IndexIndicator !== "") {
                let Precision = [],
                MeasureDescription = [],
                MeasureValue = [],
                Format=[];    

                last25DaysDateResults.forEach((row, index) => {
                    MeasureDescription[index] = row.MeasureDescription || "";
                    Format[index] = row.Format || "Number";            
                    Precision[index] = row.Precision || "0";    
                    MeasureValue[index] = formatNumericOutput(row.MeasureValue, Format[index], Precision[index]) || "";
                });
                
                return {
                    last25DaysDateResults,
                    MeasureDescription,
                    MeasureValue,
                    Precision,
                    Format
                };

            }

            return null;

        } catch (error) {
            console.error("Database error:", error);
        }
    }

    const results = await fetchGatewayScoreboard();
    const last25DaysDateResults = await fetchlast25DaysScoreboard();
    console.log("results:",results.MeasureValue)
    console.log("last25DaysDateResults:",last25DaysDateResults.MeasureValue)

    res.render('index',{
        results: results, 
        last25DaysDateResults:last25DaysDateResults, 
        kpiDate:kpiDate, 
        subscription:subscription, 
        storeHeading:storeHeading, 
        categoryHeading:categoryHeading, 
        supplierHeading:supplierHeading, 
        ShowWizard:ObjectVariables.ShowWizard, 
        IsGroup:ObjectVariables.IsGroup,
        ObjectOne:ObjectVariables.ObjectOne,
        ObjectMany:ObjectVariables.ObjectMany,
        GraphLink:ObjectVariables.GraphLink});
    // await res.sendFile(path.join(__dirname, 'frontend/index.html'))
})

app.use(express.static('frontend'));
app.use(express.json());

// Actions to update the scoreboard page based on user's filtering selection
app.post('/processScoreboard', async (req, res) => {
    
    const ChildLevel = req.body.ChildLevel;
    const childKey = req.body.ChildKey;
    const parentLevel = req.body.ParentLevel;
    const parentKey = req.body.ParentKey;
    const SelectedDataSource = req.session.SelectedDataSource;
    const CurrentDate = req.session.CurrentDate;
    const CurrentDateDisplay = req.session.CurrentDateDisplay;
    const last25DaysDate = req.session.last25DaysDate;

    console.log("ChildLevel:", ChildLevel);
    console.log("childKey:", childKey);
    // console.log("parentLevel:", parentLevel);
    // console.log("parentKey:", parentKey);

    // Function to execute the stored procedure and fetch results
    async function fetchGatewayScoreboard() {
        try {
            
            const result = await sql.query`EXEC _GetObjectsScoreboard @UserSubscription=${SelectedDataSource},@ParentLevel=${parentLevel},@ParentKey=${parentKey}, @ChildLevel= ${ChildLevel}, @ChildKey = ${childKey}, @Date=${CurrentDate}`;

            const rsResults = result.recordset;
            // console.log(rsResults)
            if (rsResults.length > 0 && rsResults[0].IndexIndicator !== "") {
                let MeasureKey = [],
                    MeasureID = [],
                    MeasureDescription = [],
                    MeasureName = [],
                    MeasureGroup = [],
                    PerspectiveName = [],
                    Format = [],
                    Precision = [],
                    Rank = [],
                    ParentMeasure = [],
                    MeasureValue = [],
                    MeasureIndicator = [],
                    IndexIndicator = [],
                    Best = [],
                    Worst = [],
                    TotalObjects = [];    

                rsResults.forEach((row, index) => {
                    MeasureKey[index] = row.MeasureKey || "";
                    MeasureID[index] = row.MeasureID || "";
                    MeasureDescription[index] = row.MeasureDescription || "";
                    MeasureName[index] = row.MeasureName || "";
                    MeasureGroup[index] = row.MeasureGroup || "";
                    PerspectiveName[index] = row.PerspectiveName || "";
                    Format[index] = row.Format || "Number";
                    Precision[index] = row.Precision || "0";
                    TotalObjects[index] = row.WorstRank || "-";

                    MeasureValue[index] = formatNumericOutput(row.MeasureValue, Format[index], Precision[index]) || "-";
                    ParentMeasure[index] = formatNumericOutput(row.ParentMeasure, Format[index], Precision[index]) || "-";
                    Best[index] = formatNumericOutput(row.BestMeasureValue, Format[index], Precision[index]) || "-";
                    Worst[index] = formatNumericOutput(row.WorstMeasureValue, Format[index], Precision[index]) || "-";
                    Rank[index] = row.Ranking || "-";

                    IndexIndicator[index] = scoreboardIndicator(row.IndexIndicator);
                    MeasureIndicator[index] = scoreboardIndicator(row.MeasureIndicator);
                });
                
                return {
                    rsResults,
                    MeasureKey,
                    MeasureID,
                    MeasureDescription,
                    MeasureName,
                    MeasureGroup,
                    PerspectiveName,
                    Format,
                    Precision,
                    Rank,
                    ParentMeasure,
                    MeasureValue,
                    MeasureIndicator,
                    IndexIndicator,
                    Best,
                    Worst,
                    TotalObjects
                };

            }

            return null;

        } catch (error) {
            console.error("Database error:", error);
        }
    }

    // Helper functions
    function formatNumericOutput(number, format, precision) {
        let output = number;

        if (number == null || number === "") {
            output = "";
        } else {
            format = format.toUpperCase();
            switch (format) {
                case "NUMBER":
                    output = Number(number).toFixed(precision);
                    break;
                case "CURRENCY":
                    output = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: precision }).format(number);
                    break;
                case "PERCENT":
                    output = (Number(number) * 100).toFixed(precision) + '%';
                    break;
                case "TEXT":
                    output = number;
                    break;
                default:
                    output = "";
                    break;
            }
        }
        return output;
    }

    function nth(rank) {
        // Logic to convert ranking into ordinal form, like 1st, 2nd, etc.
        if (!rank) return null;
        const suffix = ["th", "st", "nd", "rd"];
        const v = rank % 100;
        return rank + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
    }

    function scoreboardIndicator(value) {
        let indicatorOutput;
                
        if (value === null || value === "") {
            indicatorOutput = "Not";
        } else {
            switch (value) {
                case "1":
                    indicatorOutput = "Good";
                    break;
                case "-1":
                    indicatorOutput = "Bad";
                    break;
                case "0":
                    indicatorOutput = "Average";
                    break;
                default:
                    indicatorOutput = "Not";
                    break;
            }
        }

        return indicatorOutput;
    }

    const subResult = await sql.query`EXEC _GetSubscriptionObjectDetails @UserSubscription=${SelectedDataSource}`;
    const subscription = subResult.recordset[0]
    const kpiDate = CurrentDateDisplay
    const ClientGroup = subResult.recordset[0].GroupName

    const storeHeading = "All"
    const categoryHeading = "All"
    const supplierHeading = "All"

    //Define objectType's variables
    function ObjectTypeVariables (ObjectType) {
        let ShowWizard, IsGroup, ObjectOne, ObjectMany, GraphLink;

        switch (ObjectType) {
            case "Store":
                ShowWizard = true;
                IsGroup = false;
                ObjectOne = "Store";
                ObjectMany = "Stores";
                GraphLink = `StoreFilter=${encodeURIComponent(childKey)}&Subscription=${encodeURIComponent(SelectedDataSource)}&Date=${encodeURIComponent(CurrentDate)}&Viewing=${encodeURIComponent(ClientGroup)}&Group=${encodeURIComponent(ClientGroup)}&IsCluster=0`;
                break;

            case "StoreCluster":
                ShowWizard = false;
                IsGroup = true;
                ObjectOne = "Store";
                ObjectMany = "Stores";
                GraphLink = `FlipObjects=true&RangeFilter=-2&Subscription=${encodeURIComponent(SelectedDataSource)}&Date=${encodeURIComponent(CurrentDate)}&Viewing=${encodeURIComponent(ClientGroup)}&Group=${encodeURIComponent(ClientGroup)}`;
                break;

            case "GroupStore":
                ShowWizard = false;
                IsGroup = true;
                ObjectOne = "Store";
                ObjectMany = "Stores";
                GraphLink = `Subscription=${encodeURIComponent(SelectedDataSource)}&Date=${encodeURIComponent(CurrentDate)}&Viewing=Stores&HideAverage=true&GroupStores=true&Group=${encodeURIComponent(ClientGroup)}`;
                break;

            case "Category":
                ShowWizard = false;
                IsGroup = false;
                ObjectOne = "Category";
                ObjectMany = "Categories";
                GraphLink = `CategoryFilter=${encodeURIComponent(childKey)}&Subscription=${encodeURIComponent(SelectedDataSource)}&Date=${encodeURIComponent(CurrentDate)}&Viewing=${encodeURIComponent(ClientGroup)}&Group=${encodeURIComponent(ClientGroup)}&IsCluster=0`;
                break;

            case "GroupCategory":
                ShowWizard = false;
                IsGroup = true;
                ObjectOne = "Category";
                ObjectMany = "Categories";
                GraphLink = `Subscription=${encodeURIComponent(SelectedDataSource)}&Date=${encodeURIComponent(CurrentDate)}&Viewing=Categories&HideAverage=true&Group=${encodeURIComponent(ClientGroup)}`;
                break;

            case "Supplier":
                ShowWizard = false;
                IsGroup = false;
                ObjectOne = "Supplier";
                ObjectMany = "Suppliers";
                GraphLink = `SupplierFilter=${encodeURIComponent(childKey)}&Subscription=${encodeURIComponent(SelectedDataSource)}&Date=${encodeURIComponent(CurrentDate)}&Viewing=${encodeURIComponent(ClientGroup)}&Group=${encodeURIComponent(ClientGroup)}&IsCluster=0`;
                break;

            case "GroupSupplier":
                ShowWizard = false;
                IsGroup = true;
                ObjectOne = "Supplier";
                ObjectMany = "Suppliers";
                GraphLink = `Subscription=${encodeURIComponent(SelectedDataSource)}&Date=${encodeURIComponent(CurrentDate)}&Viewing=Suppliers&HideAverage=true&Group=${encodeURIComponent(ClientGroup)}`;
                break;

            default:
                ShowWizard = false;
                IsGroup = true;
                ObjectOne = "Store";
                ObjectMany = "Stores";
                GraphLink = `&Subscription=${encodeURIComponent(SelectedDataSource)}&Date=${encodeURIComponent(CurrentDate)}&Viewing=${encodeURIComponent(ClientGroup)}`;
                break;
        }
    return {ShowWizard,IsGroup,ObjectOne,ObjectMany,GraphLink}
    }
    
    let ObjectVariables;
    if (ChildLevel ==="Store" && childKey === null) {
        ObjectVariables = ObjectTypeVariables('GroupStore');
    } else if (ChildLevel ==="Store" && childKey) {
        ObjectVariables = ObjectTypeVariables('Store');
    } else if (ChildLevel ==="Category" && childKey === null) {
        ObjectVariables = ObjectTypeVariables('GroupCategory');
    } else if (ChildLevel ==="Category" && childKey) {
        ObjectVariables = ObjectTypeVariables('Category');
    } else if (ChildLevel ==="Supplier" && childKey === null) {
        ObjectVariables = ObjectTypeVariables('GroupSupplier');
    } else if (ChildLevel ==="Supplier" && childKey) {
        ObjectVariables = ObjectTypeVariables('Supplier');
    } else {
        ObjectVariables = ObjectTypeVariables('GroupStore');
    };

    async function fetchlast25DaysScoreboard() {
        try {
            const result = await sql.query`EXEC _GetObjectsScoreboard @UserSubscription=${SelectedDataSource},@ParentLevel=null,@ParentKey=null, @ChildLevel= ${ChildLevel}, @ChildKey = ${childKey}, @Date=${last25DaysDate}`;

            const last25DaysDateResults = result.recordset;
            // console.log(rsResults)
            if (last25DaysDateResults.length > 0 && last25DaysDateResults[0].IndexIndicator !== "") {
                let Precision = [],
                MeasureDescription = [],
                MeasureValue = [],
                Format=[];    

                last25DaysDateResults.forEach((row, index) => {
                    MeasureDescription[index] = row.MeasureDescription || "";
                    Format[index] = row.Format || "Number";            
                    Precision[index] = row.Precision || "0";    
                    MeasureValue[index] = formatNumericOutput(row.MeasureValue, Format[index], Precision[index]) || "";
                });
                
                return {
                    last25DaysDateResults,
                    MeasureDescription,
                    MeasureValue,
                    Precision,
                    Format
                };

            }

            return null;

        } catch (error) {
            console.error("Database error:", error);
        }
    }

    const results = await fetchGatewayScoreboard();
    const last25DaysDateResults = await fetchlast25DaysScoreboard();
    console.log("results:",results.MeasureValue)
    console.log("last25DaysDateResults:",last25DaysDateResults.MeasureValue)
    res.json({
        success: true, 
        data: {
            results: results, 
            last25DaysDateResults:last25DaysDateResults,
            kpiDate:kpiDate, 
            subscription:subscription, 
            storeHeading:storeHeading, 
            categoryHeading:categoryHeading, 
            supplierHeading:supplierHeading,
            ChildLevel:ChildLevel, 
            childKey:childKey,
            ShowWizard:ObjectVariables.ShowWizard, 
            IsGroup:ObjectVariables.IsGroup,
            ObjectOne:ObjectVariables.ObjectOne,
            ObjectMany:ObjectVariables.ObjectMany,
            GraphLink: ObjectVariables.GraphLink}});
});

// Render the TOOLKIT scoreboard page based on user's subscription
app.get('/toolkit', async (req,res) => {
    
    const SelectedDataSource = req.query.DS;
    const SelectedObjectKey = req.query.Key;
    const StoreName = req.query.Store;
    const CurrentDate = req.query.CurrentDate;
    const CurrentDateDisplay = req.query.CurrentDateDisplay;

    let currentdate = new Date(CurrentDate);
    currentdate.setDate(currentdate.getDate() - 25);
    let last25DaysDate = currentdate.toISOString().split('T')[0];

    console.log("last25DaysDate:",last25DaysDate)

    req.session.SelectedDataSource = SelectedDataSource;
    req.session.SelectedObjectKey = SelectedObjectKey;
    req.session.StoreName = StoreName;
    req.session.CurrentDate = CurrentDate;
    req.session.CurrentDateDisplay = CurrentDateDisplay;
    req.session.last25DaysDate = last25DaysDate;

    // Function to execute the stored procedure and fetch results
    async function fetchToolkitScoreboard() {
        try {
            const result = await sql.query`EXEC GatewayScoreboard_StoreToggle @UserSubscription=${SelectedDataSource},@StoreKey=${SelectedObjectKey}, @Date=${CurrentDate},@Toggle ='Group'`;

            const rsResults = result.recordset;
            // console.log(rsResults)
            if (rsResults.length > 0 && rsResults[0].IndexIndicator !== "") {
                let MeasureKey = [],
                    MeasureID = [],
                    MeasureDescription = [],
                    MeasureName = [],
                    MeasureGroup = [],
                    PerspectiveName = [],
                    Format = [],
                    Precision = [],
                    Rank = [],
                    ParentMeasure = [],
                    MeasureValue = [],
                    MeasureIndicator = [],
                    IndexIndicator = [],
                    Best = [],
                    Worst = [],
                    TotalObjects = [];    

                rsResults.forEach((row, index) => {
                    MeasureKey[index] = row.MeasureKey || "";
                    MeasureID[index] = row.MeasureID || "";
                    MeasureDescription[index] = row.MeasureDescription || "";
                    MeasureName[index] = row.MeasureName || "";
                    MeasureGroup[index] = row.MeasureGroup || "";
                    PerspectiveName[index] = row.PerspectiveName || "";
                    Format[index] = row.Format || "Number";
                    Precision[index] = row.Precision || "0";
                    TotalObjects[index] = row.WorstRank || "-";

                    MeasureValue[index] = formatNumericOutput(row.MeasureValue, Format[index], Precision[index]) || "-";
                    ParentMeasure[index] = formatNumericOutput(row.ParentMeasure, Format[index], Precision[index]) || "-";
                    Best[index] = formatNumericOutput(row.BestMeasureValue, Format[index], Precision[index]) || "-";
                    Worst[index] = formatNumericOutput(row.WorstMeasureValue, Format[index], Precision[index]) || "-";
                    Rank[index] = row.Ranking || "-";

                    IndexIndicator[index] = scoreboardIndicator(row.IndexIndicator);
                    MeasureIndicator[index] = scoreboardIndicator(row.MeasureIndicator);
                });
                

                return {
                    rsResults,
                    MeasureKey,
                    MeasureID,
                    MeasureDescription,
                    MeasureName,
                    MeasureGroup,
                    PerspectiveName,
                    Format,
                    Precision,
                    Rank,
                    ParentMeasure,
                    MeasureValue,
                    MeasureIndicator,
                    IndexIndicator,
                    Best,
                    Worst,
                    TotalObjects
                };

            }

            return null;

        } catch (error) {
            console.error("Database error:", error);
        }
    }
    app.use(express.static('frontend'));


    // Helper functions
    function formatNumericOutput(number, format, precision) {
        let output = number;
    
        if (number == null || number === "") {
            output = "";
        } else {
            format = format.toUpperCase();
            switch (format) {
                case "NUMBER":
                    output = Number(number).toFixed(precision);
                    break;
                case "CURRENCY":
                    output = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: precision }).format(number);
                    break;
                case "PERCENT":
                    output = (Number(number) * 100).toFixed(precision) + '%';
                    break;
                case "TEXT":
                    output = number;
                    break;
                default:
                    output = "";
                    break;
            }
        }
        return output;
    }

    function nth(rank) {
        if (!rank) return null;
        const suffix = ["th", "st", "nd", "rd"];
        const v = rank % 100;
        return rank + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
    }

    function scoreboardIndicator(value) {
        let indicatorOutput;
                
        if (value === null || value === "") {
            indicatorOutput = "Not";
        } else {
            switch (value) {
                case "1":
                    indicatorOutput = "Good";
                    break;
                case "-1":
                    indicatorOutput = "Bad";
                    break;
                case "0":
                    indicatorOutput = "Average";
                    break;
                default:
                    indicatorOutput = "Not";
                    break;
            }
        }
    
        return indicatorOutput;
    }
    
    const subResult = await sql.query`EXEC _GetSubscriptionObjectDetails @UserSubscription=${SelectedDataSource}`;
    const subscription = subResult.recordset[0]
    const kpiDate = CurrentDateDisplay
    const ClientGroup = subResult.recordset[0].GroupName

    const storeHeading = "All"
    const categoryHeading = "All"
    const supplierHeading = "All"

    function ObjectTypeVariables (ObjectType) {
        let ShowWizard, IsGroup, ObjectOne, ObjectMany, GraphLink;

        switch (ObjectType) {
            case "Store":
                ShowWizard = true;
                IsGroup = false;
                ObjectOne = "Store";
                ObjectMany = "Stores";
                GraphLink = `StoreFilter=${encodeURIComponent(SelectedObjectKey)}&Subscription=${encodeURIComponent(SelectedDataSource)}&Date=${encodeURIComponent(CurrentDate)}&Viewing=${encodeURIComponent(StoreName)}&Group=${encodeURIComponent(ClientGroup)}&IsCluster=0`;
                break;

            case "StoreCluster":
                ShowWizard = false;
                IsGroup = true;
                ObjectOne = "Store";
                ObjectMany = "Stores";
                GraphLink = `FlipObjects=true&RangeFilter=-2&Subscription=${encodeURIComponent(SelectedDataSource)}&Date=${encodeURIComponent(CurrentDate)}&Viewing=${encodeURIComponent(ClientGroup)}&Group=${encodeURIComponent(ClientGroup)}`;
                break;

            case "GroupStore":
                ShowWizard = false;
                IsGroup = true;
                ObjectOne = "Store";
                ObjectMany = "Stores";
                GraphLink = `Subscription=${encodeURIComponent(SelectedDataSource)}&Date=${encodeURIComponent(CurrentDate)}&Viewing=Stores&HideAverage=true&GroupStores=true&Group=${encodeURIComponent(ClientGroup)}`;
                break;

            case "Category":
                ShowWizard = false;
                IsGroup = false;
                ObjectOne = "Category";
                ObjectMany = "Categories";
                GraphLink = `CategoryFilter=${encodeURIComponent(SelectedObjectKey)}&Subscription=${encodeURIComponent(SelectedDataSource)}&Date=${encodeURIComponent(CurrentDate)}&Viewing=${encodeURIComponent(ClientGroup)}&Group=${encodeURIComponent(ClientGroup)}&IsCluster=0`;
                break;

            case "GroupCategory":
                ShowWizard = false;
                IsGroup = true;
                ObjectOne = "Category";
                ObjectMany = "Categories";
                GraphLink = `Subscription=${encodeURIComponent(SelectedDataSource)}&Date=${encodeURIComponent(CurrentDate)}&Viewing=Categories&HideAverage=true&Group=${encodeURIComponent(ClientGroup)}`;
                break;

            case "Supplier":
                ShowWizard = false;
                IsGroup = false;
                ObjectOne = "Supplier";
                ObjectMany = "Suppliers";
                GraphLink = `SupplierFilter=${encodeURIComponent(SelectedObjectKey)}&Subscription=${encodeURIComponent(SelectedDataSource)}&Date=${encodeURIComponent(CurrentDate)}&Viewing=${encodeURIComponent(ClientGroup)}&Group=${encodeURIComponent(ClientGroup)}&IsCluster=0`;
                break;

            case "GroupSupplier":
                ShowWizard = false;
                IsGroup = true;
                ObjectOne = "Supplier";
                ObjectMany = "Suppliers";
                GraphLink = `Subscription=${encodeURIComponent(SelectedDataSource)}&Date=${encodeURIComponent(CurrentDate)}&Viewing=Suppliers&HideAverage=true&Group=${encodeURIComponent(ClientGroup)}`;
                break;

            default:
                ShowWizard = false;
                IsGroup = true;
                ObjectOne = "Store";
                ObjectMany = "Stores";
                GraphLink = `Subscription=${encodeURIComponent(SelectedDataSource)}&Date=${encodeURIComponent(CurrentDate)}&Viewing=${encodeURIComponent(ClientGroup)}`;
                break;
        }
    return {ShowWizard,IsGroup,ObjectOne,ObjectMany,GraphLink}
}
    let ObjectVariables = ObjectTypeVariables('Store');

    async function fetchlast25DaysToolkitScoreboard() {
        try {
            const result = await sql.query`EXEC GatewayScoreboard_StoreToggle @UserSubscription=${SelectedDataSource},@StoreKey=${SelectedObjectKey}, @Date=${last25DaysDate},@Toggle ='Group'`;

            const last25DaysDateResults = result.recordset;
            // console.log(rsResults)
            if (last25DaysDateResults.length > 0 && last25DaysDateResults[0].IndexIndicator !== "") {
                let Precision = [],
                MeasureDescription = [],
                MeasureValue = [],
                Format=[];    

                last25DaysDateResults.forEach((row, index) => {
                    MeasureDescription[index] = row.MeasureDescription || "";
                    Format[index] = row.Format || "Number";            
                    Precision[index] = row.Precision || "0";    
                    MeasureValue[index] = formatNumericOutput(row.MeasureValue, Format[index], Precision[index]) || "";
                });
                
                return {
                    last25DaysDateResults,
                    MeasureDescription,
                    MeasureValue,
                    Precision,
                    Format
                };

            }

            return null;

        } catch (error) {
            console.error("Database error:", error);
        }
    }

    const results = await fetchToolkitScoreboard();
    const last25DaysDateResults = await fetchlast25DaysToolkitScoreboard();
    console.log("results:",results.MeasureValue)
    console.log("last25DaysDateResults:",last25DaysDateResults.MeasureValue)

    res.render('toolkit',{
        results: results, 
        last25DaysDateResults:last25DaysDateResults, 
        SelectedObjectKey:SelectedObjectKey,
        StoreName:StoreName,
        kpiDate:kpiDate, 
        subscription:subscription, 
        storeHeading:storeHeading, 
        categoryHeading:categoryHeading, 
        supplierHeading:supplierHeading, 
        ShowWizard:ObjectVariables.ShowWizard, 
        IsGroup:ObjectVariables.IsGroup,
        ObjectOne:ObjectVariables.ObjectOne,
        ObjectMany:ObjectVariables.ObjectMany,
        GraphLink:ObjectVariables.GraphLink});
    // await res.sendFile(path.join(__dirname, 'frontend/index.html'))
})
app.use(express.static('frontend'));

//Check user's subscription details
app.get('/dbGetSubscription', async (req,res) =>  {
    try {
        const SelectedDataSource = req.session.SelectedDataSource;
        const result = await sql.query`EXEC _GetSubscriptionObjectDetails @UserSubscription=${SelectedDataSource}`;
        console.log(result.recordset);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

//Get all stores details based on user's subscription
app.get('/dbStores', async (req,res) =>  {
    try {
        const SelectedDataSource = req.session.SelectedDataSource;
        const result = await sql.query`EXEC _GetStoreDetails @UserSubscription=${SelectedDataSource}, @IsDisplayedOnly=1,@StoreKeys=null`;
        const stores = result.recordset;
        const storeNames = stores.map(item => item.StoreName);
        const storeKey = stores.map(item => item.DimStoreKey);
        
        res.json({storeNames,storeKey});
    } catch (err) {
        res.status(500).send(err.message);
    }
})

//Get all categories details based on user's subscription
app.get('/dbCategories', async (req,res) =>  {
    try {
        const SelectedDataSource = req.session.SelectedDataSource;
        const result = await sql.query`EXEC _GetCategoryDetails_Nav @UserSubscription=${SelectedDataSource}, @CategoryKeys=null`;
        const categories = result.recordset;
        const uniqueCategoriesNames = Array.from(new Map(categories.map(category => [category.CategoryName, category])).values());
        const uniqueCategoriesKey = Array.from(new Map(categories.map(category => [category.DimCategoryKey, category])).values());

        const categoryNames = uniqueCategoriesNames.map(item => item.CategoryName);
        const categoryKey = uniqueCategoriesKey.map(item => item.DimCategoryKey);

        res.json({categoryNames,categoryKey});
    } catch (err) {
        res.status(500).send(err.message);
    }
})

//Get all suppliers details based on user's subscription
app.get('/dbSuppliers', async (req,res) =>  {
    try {
        const SelectedDataSource = req.session.SelectedDataSource;
        const result = await sql.query`EXEC _GetSupplierDetails @UserSubscription=${SelectedDataSource}, @IsDisplayedOnly=1,@SupplierKeys=null`;
        const suppliers = result.recordset;
        const suppliersNames = suppliers.map(item => item.SupplierName);
        const supplierKey = suppliers.map(item => item.DimSupplierKey);

        res.json({suppliersNames,supplierKey});
    } catch (err) {
        res.status(500).send(err.message);
    }
})

//app hosted on port 3000
const port = process.env.PORT || 3000;
app.listen(port);