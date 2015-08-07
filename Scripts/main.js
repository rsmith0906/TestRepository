
 var selectDate;

$(document).ready(function () {

    $('#txtDeadline').datetimepicker({
        sideBySide: true
    }).on("dp.change", function (e) {
        var date = e.date; //e.date is a moment object
        selectDate = date.format("MM/DD/YYYY HH:mm");
        var target = $(e.target).attr('name');
    });

    var fileInput = document.getElementById('fileInput');
    $("#btRemoveProduct").prop("disabled", true);
    $("#btAddLanguage").prop("disabled", true);
    $("#btRemoveLanguage").prop("disabled", true);

    $("#collapseOne").collapse('hide');
    $("#toggleExpand").removeClass('glyphicon-collapse-up');
    $("#toggleExpand").addClass('glyphicon-collapse-down');

    fileInput.addEventListener('change', function (e) {
        // Put the rest of the demo code here.

        var control = document.getElementById('fileInput');

        var i = 0,
        files = control.files;
        var file = files[i];

        var reader = new FileReader();

        reader.onload = function (event) {
            var contents = event.target.result;
            var xmlOutput = vkbeautify.xml(contents);
            $('textarea#xmlText').val(xmlOutput);

            loadUploadXmlFile();
        };

        reader.onerror = function (event) {
            throw "File could not be read! Code " + event.target.error.code;
        };

        reader.readAsText(file);
    });

    resizeWindow();

    $(window).resize(function () {
        resizeWindow();
    });

    //$(".alert").addClass("in").fadeOut(4500);

    $('#txtPidKey').keyup(function () {

        validatePidKey(this);

    });

    /* swap open/close side menu icons */
    $('[data-toggle=collapse]').click(function () {
        // toggle icon
        $(this).find("i").toggleClass("glyphicon-chevron-right glyphicon-chevron-down");
    });

    $("#btAddProduct").button().click(function () {
        var xmlDoc = getXmlDocument();

        odtAddProduct(xmlDoc);

        displayXml(xmlDoc);

        $("#btAddProduct").text('Edit Product');

        return false;
    });

    $("#btRemoveProduct").button().click(function () {
        var xmlDoc = getXmlDocument();

        odtRemoveProduct(xmlDoc);

        displayXml(xmlDoc);

        return false;
    });

    $("#btAddLanguage").button().click(function () {
        var xmlDoc = getXmlDocument();

        odtAddLanguage(xmlDoc);

        displayXml(xmlDoc);
        return false;
    });

    $("#btRemoveLanguage").button().click(function () {
        var xmlDoc = getXmlDocument();

        odtRemoveLanguage(xmlDoc);

        displayXml(xmlDoc);
        return false;
    });

    $("#cbProduct").change(function () {
        var end = this.value;
        changeSelectedProduct();
    });

    $("#cbLanguage").change(function () {
        var end = this.value;
        changeSelectedLanguage();
    });

    $("#btAddExcludeApp").button().click(function () {
        var xmlDoc = getXmlDocument();

        odtAddExcludeApp(xmlDoc);

        displayXml(xmlDoc);
        return false;
    });

    $("#btRemoveExcludeApp").button().click(function () {
        var xmlDoc = getXmlDocument();

        odtRemoveExcludeApp(xmlDoc);

        displayXml(xmlDoc);
        return false;
    });

    $("#btAddRemoveProduct").button().click(function () {
        var xmlDoc = getXmlDocument();

        odtAddRemoveApp(xmlDoc);

        displayXml(xmlDoc);
        return false;
    });

    $("#btAddRemoveLanguage").button().click(function () {
        var xmlDoc = getXmlDocument();

        odtAddRemoveLanguage(xmlDoc);

        displayXml(xmlDoc);
        return false;
    });

    $("#btRemoveRemoveLanguage").button().click(function () {
        var xmlDoc = getXmlDocument();

        odtRemoveRemoveLanguage(xmlDoc);

        displayXml(xmlDoc);
        return false;
    });

    $("#btSaveUpdates").button().click(function () {
        var xmlDoc = getXmlDocument();

        odtSaveUpdates(xmlDoc);

        displayXml(xmlDoc);
        return false;
    });

    $("#btRemovesUpdates").button().click(function () {
        var xmlDoc = getXmlDocument();

        odtRemoveUpdates(xmlDoc);

        displayXml(xmlDoc);
        return false;
    });

    $("#btSaveDisplay").button().click(function () {
        var xmlDoc = getXmlDocument();

        odtSaveDisplay(xmlDoc);

        displayXml(xmlDoc);
        return false;
    });

    $("#btRemoveDisplay").button().click(function () {
        var xmlDoc = getXmlDocument();

        odtRemoveDisplay(xmlDoc);

        displayXml(xmlDoc);
        return false;
    });

    $("#btSaveLogging").button().click(function () {
        var xmlDoc = getXmlDocument();

        odtSaveLogging(xmlDoc);

        displayXml(xmlDoc);
        return false;
    });

    $("#btRemoveLogging").button().click(function () {
        var xmlDoc = getXmlDocument();

        odtRemoveLogging(xmlDoc);

        displayXml(xmlDoc);
        return false;
    });

});

function toggleExpandOptional(source) {

    if ($("#toggleExpand").hasClass('glyphicon-collapse-up')) {
        $("#toggleExpand").removeClass('glyphicon-collapse-up');
        $("#toggleExpand").addClass('glyphicon-collapse-down');
    } else {
        $("#toggleExpand").addClass('glyphicon-collapse-up');
        $("#toggleExpand").removeClass('glyphicon-collapse-down');
    }

}

function download() {
    var xmlDoc = getXmlDocument();
    var xmlString = (new XMLSerializer().serializeToString(xmlDoc.documentElement));
    var xmlOutput = vkbeautify.xml(xmlString);

    xmlOutput = xmlOutput.replace(/\n/g, "\r\n");

    var blob = new Blob([xmlOutput], { type: "text/xml" });
    saveAs(blob, "configuration.xml");
}

function validatePidKey(t) {
    //if (!this.value.match(/[0-9]/)) {
    //    this.value = this.value.replace(/[^0-9]/g, '');
    //}

    var currentText = t.value;
    if (currentText.length > 5) {

        var firstPart = "";
        var secondPart = "";

        var dash1 = currentText.substring(5, 6);
        if (dash1 != "-") {
            var firstPart = currentText.substring(0, 5);
            var restPart = currentText.substring(5, currentText.length);

            firstPart = firstPart + "-" + restPart;
            t.value = firstPart;
        }

        var dash2 = currentText.substring(10, 11);
        if (dash2 != "-") {
            var firstPart2 = currentText.substring(10, 15);
            var restPart2 = currentText.substring(10, currentText.length);

            secondPart = firstPart2 + "-" + restPart2;
            t.value = firstPart + secondPart;
        }
    }
}

function changeSelectedLanguage() {
    var selectedProduct = $("#cbProduct").val();
    var selectLanguage = $("#cbLanguage").val();

    var xmlDoc = getXmlDocument();
            
    $("#btAddLanguage").prop("disabled", false);

    var addNode = null;
    var nodes = xmlDoc.documentElement.getElementsByTagName("Add");
    if (nodes.length > 0) {
        addNode = xmlDoc.documentElement.getElementsByTagName("Add")[0];
    }

    if (addNode) {
        var productNode = getProductNode(addNode, selectedProduct);

        var langNode = getLanguageNode(productNode, selectLanguage);
        if (langNode) {
            $("#btAddLanguage").prop("disabled", true);
        }
    }
}

function changeSelectedProduct() {
    var productId = $('#cbProduct').val();

    var xmlDoc = getXmlDocument();

    $("#txtPidKey").val("");

    var productCount = getAddProductCount(xmlDoc);
    if (productCount > 0) {
        var productNode = getProductNode(xmlDoc, productId);
        if (productNode) {
            $("#btAddProduct").text('Edit Product');
            $("#btRemoveProduct").prop("disabled", false);

            var pidKey = productNode.getAttribute("PIDKEY");
            if (pidKey) {
                $("#txtPidKey").val(pidKey);
            }

            var excludeApps = productNode.getElementsByTagName("ExcludeApp");
            if (excludeApps.length == 0) {
                $("#btRemoveExcludeApp").prop("disabled", true);
                $("select#cbExcludeApp").prop('selectedIndex', 0);
            } else {
                $("#btRemoveExcludeApp").prop("disabled", false);

                var excludeApp = excludeApps[0];
                if (excludeApp) {
                    $("#cbExcludeApp").val(excludeApp.getAttribute("ID"));
                }
            }

        } else {
            $("#btAddProduct").text('Add Product');
            //$("#btRemoveProduct").prop("disabled", true);
            $("#btRemoveExcludeApp").prop("disabled", true);
            $("select#cbExcludeApp").prop('selectedIndex', 0);
        }
    } else {
        $("#btRemoveProduct").prop("disabled", true);
    }

    var langCount = getLanguageNodeCount(xmlDoc, productId);
    $("#btRemoveLanguage").prop("disabled", !(langCount > 1));
}

function loadUploadXmlFile() {
    var xmlDoc = getXmlDocument();

    var addNode = null;
    var nodes = xmlDoc.documentElement.getElementsByTagName("Add");
    if (nodes.length > 0) {
        addNode = xmlDoc.documentElement.getElementsByTagName("Add")[0];

        var selectBitness = addNode.getAttribute("OfficeClientEdition");
        $("#cbEdition").val(selectBitness);

        var products = addNode.getElementsByTagName("Product");
        if (products.length > 0) {
            var product = products[0];
            var productId = product.getAttribute("ID");

            $("#cbProduct").val(productId);

            var pidKey = product.getAttribute("PIDKEY");
            $("#txtPidKey").val(pidKey);

            var exApps = product.getElementsByTagName("ExcludeApp");
            if (exApps.length > 0) {
                var exApp = exApps[0];
                var excludeAppId = exApp.getAttribute("ID");
                $("#cbExcludeApp").val(excludeAppId);

                $("#btRemoveExcludeApp").prop("disabled", false);
            } else {
                $("#btRemoveExcludeApp").prop("disabled", true);
            }
        }

        var version = addNode.getAttribute("Version");
        $("#txtVersion").val(version);

        var version = addNode.getAttribute("SourcePath");
        $("#txtSourcePath").val(version);
    }

    var removeNode = null;
    var remvoeNodes = xmlDoc.documentElement.getElementsByTagName("Remove");
    if (remvoeNodes.length > 0) {
        removeNode = xmlDoc.documentElement.getElementsByTagName("Remove")[0];
        if (removeNode) {
            var removeProducts = removeNode.getElementsByTagName("Product");
            if (removeProducts.length > 0) {
                var removeproduct = removeProducts[0];
                var removeproductId = removeproduct.getAttribute("ID");

                $("#cbRemoveProduct").val(removeproductId);

                var removeLangs = removeproduct.getElementsByTagName("Language");
                if (removeLangs.length > 0) {
                    var removeLangId = removeLangs[0].getAttribute("ID");
                    $("#cbRemoveLanguage").val(removeLangId);
                }

                toggleRemove("removeSelectProducts");
            } else {
                toggleRemove("removeallproducts");
            }
        }
    }

    var updateNodes = xmlDoc.documentElement.getElementsByTagName("Update");
    if (updateNodes.length > 0) {
        var updateNode = xmlDoc.documentElement.getElementsByTagName("Update")[0];

        var updatesEnabled = updateNode.getAttribute("Enabled");
        var selectUpdatePath = updateNode.getAttribute("UpdatePath");
        var selectTargetVersion = updateNode.getAttribute("TargetVersion");
        var selectDeadline = updateNode.getAttribute("Deadline");

        if (updatesEnabled == "TRUE") {
            toggleUpdatesEnabled("btupdatesEnabled");
            $("#txtUpdatePath").val(selectUpdatePath);
            $("#txtTargetVersion").val(selectTargetVersion);
            $("#txtDeadline").val(selectDeadline);
        } else {
            toggleUpdatesEnabled("btupdatesDisabled");
            $("#txtUpdatePath").val("");
            $("#txtTargetVersion").val("");
            $("#txtDeadline").val("");
        }
    }

    var displayNodes = xmlDoc.documentElement.getElementsByTagName("Display");
    if (displayNodes.length > 0) {
        var displayNode = xmlDoc.documentElement.getElementsByTagName("Display")[0];

        var logLevel = displayNode.getAttribute("Level");
        var acceptEula = displayNode.getAttribute("AcceptEULA");

        if (logLevel == "None") {
            toggleDisplayLevelEnabled("btLevelNone");
        } else {
            toggleDisplayLevelEnabled("btLevelFull");
        }

        if (acceptEula == "TRUE") {
            toggleDisplayEULAEnabled("btAcceptEULAEnabled");
        } else {
            toggleDisplayEULAEnabled("btAcceptEULADisabled");
        }
    }

    var loggingNodes = xmlDoc.documentElement.getElementsByTagName("Logging");
    if (loggingNodes.length > 0) {
        var loggingNode = xmlDoc.documentElement.getElementsByTagName("Logging")[0];

        var logLevel = loggingNode.getAttribute("Level");
        var path = loggingNode.getAttribute("Path");

        if (logLevel == "Off") {
            toggleLoggingEnabled("btLoggingLevelOff");
        } else {
            toggleLoggingEnabled("btLoggingLevelStandard");
        }

        $("#txtLoggingUpdatePath").val(path);
    }

    var productCount = getAddProductCount(xmlDoc);
    if (productCount == 0) {
        $("#btRemoveProduct").prop("disabled", true);
    } else {
        $("#btRemoveProduct").prop("disabled", false);
    }

}

function resizeWindow() {
    var bodyHeight = window.innerHeight;
    var bodyWidth = window.innerWidth;
    var leftPaneHeight = bodyHeight - 180;

    //$("#mainDiv").height(bodyHeight - 70);

    //$("#removeproduct").height(leftPaneHeight);
    //$("#profile").height(leftPaneHeight);
    //$("#updates").height(leftPaneHeight);
    //$("#display").height(leftPaneHeight);
    //$("#logging").height(leftPaneHeight);

    var rightPaneHeight = bodyHeight - 100;
    $("#xmlText").height(rightPaneHeight - 100);

}

function getXmlDocument() {
    var xmlSource = $('textarea#xmlText').val();
    if (!(xmlSource)) {
        xmlSource = "<Configuration></Configuration>";
    }
    var xmlDoc = createXmlDocument(xmlSource);
    return xmlDoc;
}


function odtAddLanguage(xmlDoc) {
    var selectedProduct = $("#cbProduct").val();
    var selectLanguage = $("#cbLanguage").val();

    var addNode = xmlDoc.createElement("Add");

    var nodes = xmlDoc.documentElement.getElementsByTagName("Add");
    if (nodes.length > 0) {
        addNode = xmlDoc.documentElement.getElementsByTagName("Add")[0];

        var productNode = getProductNode(addNode, selectedProduct);
        if (productNode) {
            var langNode = getLanguageNode(productNode, selectLanguage);
            if (!(langNode)) {

                var langs = productNode.getElementsByTagName("Language");
                var lastLang = langs[langs.length - 1];

                var langList = [];
                for (var p = 0; p < langs.length; p++) {
                    var langChkNode1 = langs[p];
                    langList.push(langChkNode1);
                }

                for (var l = 0; l < langs.length; l++) {
                    var langChkNode2 = langs[l];
                    productNode.removeChild(langChkNode2);
                }

                for (var t = 0; t < langList.length ; t++) {
                    var langChkNode = langList[t];
                    productNode.appendChild(langChkNode);
                }

                langNode = xmlDoc.createElement("Language");
                langNode.setAttribute("ID", selectLanguage);
                productNode.appendChild(langNode, lastLang);

                $("#btAddLanguage").prop("disabled", true);
            }
        }
    }

    var langCount = getLanguageNodeCount(xmlDoc, selectedProduct);
    $("#btRemoveLanguage").prop("disabled", !(langCount > 1));
}

function odtRemoveLanguage(xmlDoc) {
    var selectedProduct = $("#cbProduct").val();
    var selectLanguage = $("#cbLanguage").val();

    var addNode = null;

    var nodes = xmlDoc.documentElement.getElementsByTagName("Add");
    if (nodes.length > 0) {
        addNode = xmlDoc.documentElement.getElementsByTagName("Add")[0];

        var productNode = getProductNode(addNode, selectedProduct);
        if (productNode) {
            if (getLanguageNodeCount(xmlDoc, selectedProduct) > 1) {
                var langNode = getLanguageNode(productNode, selectLanguage);
                if (langNode) {
                    productNode.removeChild(langNode);
                    $("#btAddLanguage").prop("disabled", false);
                }
            }
        }
    }

    var langCount = getLanguageNodeCount(xmlDoc, selectedProduct);
    $("#btRemoveLanguage").prop("disabled", !(langCount > 1));
}


function odtAddRemoveLanguage(xmlDoc) {
    var selectedProduct = $("#cbRemoveProduct").val();
    var selectLanguage = $("#cbRemoveLanguage").val();

    var removeNode = xmlDoc.createElement("Remove");

    var nodes = xmlDoc.documentElement.getElementsByTagName("Remove");
    if (nodes.length > 0) {
        removeNode = xmlDoc.documentElement.getElementsByTagName("Remove")[0];

        var productNode = getProductNode(removeNode, selectedProduct);
        if (productNode) {
            var langNode = getLanguageNode(productNode, selectLanguage);
            if (!(langNode)) {

                var langs = productNode.getElementsByTagName("Language");
                var lastLang = langs[langs.length - 1];

                langNode = xmlDoc.createElement("Language");
                langNode.setAttribute("ID", selectLanguage);
                productNode.insertBefore(langNode, lastLang);
            }
        }
    }

    var langCount = getRemoveLanguageNodeCount(xmlDoc, selectedProduct);
    $("#btRemoveRemoveLanguage").prop("disabled", !(langCount > 1));
}

function odtRemoveRemoveLanguage(xmlDoc) {
    var selectedProduct = $("#cbRemoveProduct").val();
    var selectLanguage = $("#cbRemoveLanguage").val();

    var removeNode = null;

    var nodes = xmlDoc.documentElement.getElementsByTagName("Remove");
    if (nodes.length > 0) {
        removeNode = xmlDoc.documentElement.getElementsByTagName("Remove")[0];

        var productNode = getProductNode(removeNode, selectedProduct);
        if (productNode) {
            if (getRemoveLanguageNodeCount(xmlDoc, selectedProduct) > 1) {
                var langNode = getLanguageNode(productNode, selectLanguage);
                if (langNode) {
                    productNode.removeChild(langNode);
                }
            }
        }
    }

    var langCount = getRemoveLanguageNodeCount(xmlDoc, selectedProduct);
    $("#btRemoveLanguage").prop("disabled", !(langCount > 1));
}



function odtAddRemoveApp(xmlDoc) {
    var selectedProduct = $("#cbRemoveProduct").val();
    var selectLanguage = $("#cbRemoveLanguage").val();

    var removeNode = xmlDoc.createElement("Remove");
    var nodes = xmlDoc.documentElement.getElementsByTagName("Remove");
    if (nodes.length > 0) {
        removeNode = xmlDoc.documentElement.getElementsByTagName("Remove")[0];
    } else {
        xmlDoc.documentElement.appendChild(removeNode);
    }

    var $removeSelect = $("#removeSelectProducts");
    if ($removeSelect.hasClass('btn-primary')) {
        removeNode.removeAttribute("ALL");

        var productNode = getProductNode(removeNode, selectedProduct);
        if (!(productNode)) {
            productNode = xmlDoc.createElement("Product");
            productNode.setAttribute("ID", selectedProduct);
            removeNode.appendChild(productNode);
        }

        var langNode = getLanguageNode(productNode, selectLanguage);
        if (!(langNode)) {
            langNode = xmlDoc.createElement("Language");
            langNode.setAttribute("ID", selectLanguage);
            productNode.appendChild(langNode);
        }
    } else {
        removeNode.setAttribute("ALL", "TRUE");
        if (removeNode.childElementCount > 0) {
            var products = removeNode.getElementsByTagName("Product");
            for (var v = 0; v < products.length; v++) {
                removeNode.removeChild(products[v]);
            }
        }
    }

    var addNode = null;
    var addNodes = xmlDoc.documentElement.getElementsByTagName("Add");
    if (addNodes.length > 0) {
        addNode = xmlDoc.documentElement.getElementsByTagName("Add")[0];
    }

    if (addNode) {
        var existingAddProduct = checkForAddProductNode(xmlDoc, selectedProduct);
        if (existingAddProduct) {
            addNode.removeChild(existingAddProduct);
        }

        if (addNode.childElementCount == 0) {
            xmlDoc.documentElement.removeChild(addNode);
        }
    }

}


function odtAddExcludeApp(xmlDoc) {
    var selectedProduct = $("#cbProduct").val();
    var selectExcludeApp = $("#cbExcludeApp").val();

    var addNode = null;

    var nodes = xmlDoc.documentElement.getElementsByTagName("Add");
    if (nodes.length > 0) {
        addNode = xmlDoc.documentElement.getElementsByTagName("Add")[0];

        var productNode = getProductNode(addNode, selectedProduct);
        if (productNode) {
            var exNode = getExcludeAppNode(productNode, selectExcludeApp);
            if (!(exNode)) {
                var excludeApps = productNode.getElementsByTagName("ExcludeApp");
                var excludeNode = excludeApps[excludeApps.length - 1];

                exNode = xmlDoc.createElement("ExcludeApp");
                exNode.setAttribute("ID", selectExcludeApp);

                if (excludeNode) {
                    productNode.insertBefore(exNode, excludeNode);
                } else {
                    productNode.appendChild(exNode);
                }
            }
        }
    }

    var exCount = getExcludeAppNodeCount(xmlDoc, selectedProduct);
    $("#btRemoveExcludeApp").prop("disabled", !(exCount > 0));
}

function odtRemoveExcludeApp(xmlDoc) {
    var selectedProduct = $("#cbProduct").val();
    var selectExcludeApp = $("#cbExcludeApp").val();

    var addNode = null;

    var nodes = xmlDoc.documentElement.getElementsByTagName("Add");
    if (nodes.length > 0) {
        addNode = xmlDoc.documentElement.getElementsByTagName("Add")[0];

        var productNode = getProductNode(addNode, selectedProduct);
        if (productNode) {
            if (getExcludeAppNodeCount(xmlDoc, selectedProduct) > 0) {
                var exNode = getExcludeAppNode(productNode, selectExcludeApp);
                if (exNode) {
                    productNode.removeChild(exNode);
                }
            }
        }
    }

    var langCount = getExcludeAppNodeCount(xmlDoc, selectedProduct);
    $("#btRemoveExcludeApp").prop("disabled", !(langCount > 0));
}


function getExcludeAppNode(excludeAppNode, selectedExcludeApp) {
    var exNode = null;
    var excludeApps = excludeAppNode.getElementsByTagName("ExcludeApp");
    for (var i = 0; i < excludeApps.length; i++) //looping xml childnodes
    {
        var excludeApp = excludeApps[i];
        var excludeAppId = excludeApp.getAttribute("ID");

        if (excludeAppId == selectedExcludeApp) {
            exNode = excludeApp;
        }
    }
    return exNode;
}

function getExcludeAppNodeCount(xmlDoc, productId) {
    var addNode = xmlDoc.createElement("Add");

    var nodes = xmlDoc.documentElement.getElementsByTagName("Add");
    if (nodes.length > 0) {
        addNode = xmlDoc.documentElement.getElementsByTagName("Add")[0];

        var productNode = getProductNode(addNode, productId);
        if (productNode) {
            var excludeApps = productNode.getElementsByTagName("ExcludeApp");
            return excludeApps.length;
        }
    }

    return 0;
}


function odtAddProduct(xmlDoc) {
    var selectedProduct = $("#cbProduct").val();
    var selectBitness = $("#cbEdition").val();
    var selectVersion = $("#txtVersion").val();
    var selectSourcePath = $("#txtSourcePath").val();
    var selectLanguage = $("#cbLanguage").val();
    var selectPidKey = $("#txtPidKey").val();

    var addNode = xmlDoc.createElement("Add");
    var nodes = xmlDoc.documentElement.getElementsByTagName("Add");
    if (nodes.length > 0) {
        addNode = xmlDoc.documentElement.getElementsByTagName("Add")[0];
    } else {
        xmlDoc.documentElement.appendChild(addNode);
    }

    if (selectSourcePath) {
        addNode.setAttribute("SourcePath", selectSourcePath);
    } else {
        addNode.removeAttribute("SourcePath");
    }

    if (selectVersion) {
        addNode.setAttribute("Version", selectVersion);
    } else {
        addNode.removeAttribute("Version");
    }

    addNode.setAttribute("OfficeClientEdition", selectBitness);

    var productNode = getProductNode(addNode, selectedProduct);
    if (!(productNode)) {
        productNode = xmlDoc.createElement("Product");
        productNode.setAttribute("ID", selectedProduct);
        addNode.appendChild(productNode);
    }

    if (selectPidKey) {
        productNode.setAttribute("PIDKEY", selectPidKey);
    } else {
        productNode.removeAttribute("PIDKEY");
    }

    var langNode = getLanguageNode(productNode, selectLanguage);
    if (!(langNode)) {
        langNode = xmlDoc.createElement("Language");
        langNode.setAttribute("ID", selectLanguage);
        productNode.appendChild(langNode);
    }

    var removeNode = null;
    var removeNodes = xmlDoc.documentElement.getElementsByTagName("Remove");
    if (removeNodes.length > 0) {
        removeNode = xmlDoc.documentElement.getElementsByTagName("Remove")[0];
    }

    if (removeNode) {
        var existingRemoveProduct = checkForRemoveProductNode(xmlDoc, selectedProduct);
        if (existingRemoveProduct) {
            removeNode.removeChild(existingRemoveProduct);
        }

        if (removeNode.childElementCount == 0) {
            xmlDoc.documentElement.removeChild(removeNode);
        }
    }

    var productCount = getAddProductCount(xmlDoc);
    if (productCount == 0) {
        $("#btRemoveProduct").prop("disabled", true);
        $("#btAddLanguage").prop("disabled", true);
        $("#btRemoveLanguage").prop("disabled", true);
    } else {
        $("#btRemoveProduct").prop("disabled", false);
        $("#btAddLanguage").prop("disabled", true);
    }
}

function odtRemoveProduct(xmlDoc) {
    var selectedProduct = $("#cbProduct").val();

    var addNode = null;

    var nodes = xmlDoc.documentElement.getElementsByTagName("Add");
    if (nodes.length > 0) {
        addNode = xmlDoc.documentElement.getElementsByTagName("Add")[0];

        var productNode = getProductNode(addNode, selectedProduct);
        if (productNode) {
            addNode.removeChild(productNode);
        }

        var products = addNode.getElementsByTagName("Product");
        if (products.length == 0) {
            addNode.parentNode.removeChild(addNode);
        }
    }

    var productCount = getAddProductCount(xmlDoc);
    if (productCount == 0) {
        $("#btRemoveProduct").prop("disabled", true);
        $("#btAddLanguage").prop("disabled", true);
        $("#btRemoveLanguage").prop("disabled", true);
    } else {
        $("#btRemoveProduct").prop("disabled", false);
        $("#btAddLanguage").prop("disabled", false);
    }

    //$("#removeAllProducts").removeClass('btn-primary');
    //$("#removeSelectProducts").removeClass('btn-primary');
    //$("#removeAllProducts").removeClass('active');
    //$("#removeSelectProducts").removeClass('active');

    $("#btAddProduct").text('Add Product');
}


function odtSaveUpdates(xmlDoc) {
    var selectUpdatePath = $("#txtUpdatePath").val();
    var selectTargetVersion = $("#txtTargetVersion").val();

    var $btUpdatesEnabled = $("#btupdatesEnabled");
    var $btUpdatesDisabled = $("#btupdatesDisabled");

    if ($btUpdatesEnabled.hasClass('btn-primary') || $btUpdatesDisabled.hasClass('btn-primary')) {

        var addNode = xmlDoc.createElement("Update");
        var nodes = xmlDoc.documentElement.getElementsByTagName("Update");
        if (nodes.length > 0) {
            addNode = xmlDoc.documentElement.getElementsByTagName("Update")[0];
        } else {
            xmlDoc.documentElement.appendChild(addNode);
        }

        if (selectUpdatePath) {
            addNode.setAttribute("UpdatePath", selectUpdatePath);
        } else {
            addNode.removeAttribute("UpdatePath");
        }

        if (selectTargetVersion) {
            addNode.setAttribute("TargetVersion", selectTargetVersion);
        } else {
            addNode.removeAttribute("TargetVersion");
        }

        if (selectDate) {
            addNode.setAttribute("Deadline", selectDate);
        } else {
            addNode.removeAttribute("Deadline");
        }

        if ($btUpdatesEnabled.hasClass('btn-primary')) {
            addNode.setAttribute("Enabled", "TRUE");
        }

        if ($btUpdatesDisabled.hasClass('btn-primary')) {
            addNode.setAttribute("Enabled", "FALSE");
            addNode.removeAttribute("UpdatePath");
            addNode.removeAttribute("TargetVersion");
            addNode.removeAttribute("Deadline");
        }

    }
}

function odtRemoveUpdates(xmlDoc) {
    var addNode = xmlDoc.createElement("Update");
    var nodes = xmlDoc.documentElement.getElementsByTagName("Update");
    if (nodes.length > 0) {
        addNode = xmlDoc.documentElement.getElementsByTagName("Update")[0];
        if (addNode) {
            xmlDoc.documentElement.removeChild(addNode);
        }
    }

    $("#btupdatesDisabled").removeClass('btn-primary');
    $("#btupdatesEnabled").removeClass('btn-primary');
    $("#btupdatesDisabled").removeClass('active');
    $("#btupdatesEnabled").removeClass('active');

    $("#txtUpdatePath").prop("disabled", true);
    $("#txtTargetVersion").prop("disabled", true);
    $("#txtDeadline").prop("disabled", true);
}


function odtSaveDisplay(xmlDoc) {
    var addNode = xmlDoc.createElement("Display");
    var nodes = xmlDoc.documentElement.getElementsByTagName("Display");
    if (nodes.length > 0) {
        addNode = xmlDoc.documentElement.getElementsByTagName("Display")[0];
    } else {
        xmlDoc.documentElement.appendChild(addNode);
    }

    var $displayLevelNone = $("#btLevelNone");
    if ($displayLevelNone.hasClass('btn-primary')) {
        addNode.setAttribute("Level", "None");
    } else {
        addNode.setAttribute("Level", "Full");
    }

    var $AcceptEulaEnabled = $("#btAcceptEULAEnabled");
    if ($AcceptEulaEnabled.hasClass('btn-primary')) {
        addNode.setAttribute("AcceptEULA", "TRUE");
    } else {
        addNode.setAttribute("AcceptEULA", "FALSE");
    }
}

function odtRemoveDisplay(xmlDoc) {
    var addNode = xmlDoc.createElement("Display");
    var nodes = xmlDoc.documentElement.getElementsByTagName("Display");
    if (nodes.length > 0) {
        addNode = xmlDoc.documentElement.getElementsByTagName("Display")[0];
        if (addNode) {
            xmlDoc.documentElement.removeChild(addNode);
        }
    }

    $("#btLevelNone").removeClass('btn-primary');
    $("#btLevelFull").removeClass('btn-primary');
    $("#btLevelNone").removeClass('active');
    $("#btLevelFull").removeClass('active');

    $("#btAcceptEULAEnabled").removeClass('btn-primary');
    $("#btAcceptEULAEnabled").removeClass('active');
    $("#btAcceptEULADisabled").removeClass('btn-primary');
    $("#btAcceptEULADisabled").removeClass('active');
}



function odtSaveLogging(xmlDoc) {
    var loggingUpdatePath = $("#txtLoggingUpdatePath").val();
    var $displayLevelNone = $("#btLoggingLevelOff");
    var $displayLevelStandard = $("#btLoggingLevelStandard");

    if ($displayLevelNone.hasClass('btn-primary') || $displayLevelStandard.hasClass('btn-primary')) {
        var addNode = xmlDoc.createElement("Logging");
        var nodes = xmlDoc.documentElement.getElementsByTagName("Logging");
        if (nodes.length > 0) {
            addNode = xmlDoc.documentElement.getElementsByTagName("Logging")[0];
        } else {
            xmlDoc.documentElement.appendChild(addNode);
        }

        if ($displayLevelNone.hasClass('btn-primary')) {
            addNode.setAttribute("Level", "Off");
        }

        if ($displayLevelStandard.hasClass('btn-primary')) {
            addNode.setAttribute("Level", "Standard");
        }

        if (loggingUpdatePath) {
            addNode.setAttribute("Path", loggingUpdatePath);
        } else {
            addNode.removeAttribute("Path");
        }
    }
}

function odtRemoveLogging(xmlDoc) {
    var addNode = xmlDoc.createElement("Logging");
    var nodes = xmlDoc.documentElement.getElementsByTagName("Logging");
    if (nodes.length > 0) {
        addNode = xmlDoc.documentElement.getElementsByTagName("Logging")[0];
        if (addNode) {
            xmlDoc.documentElement.removeChild(addNode);
        }
    }

    $("#btLoggingLevelOff").removeClass('btn-primary');
    $("#btLoggingLevelOff").removeClass('active');
    $("#btLoggingLevelStandard").removeClass('btn-primary');
    $("#btLoggingLevelStandard").removeClass('active');
}


function getProductNode(addNode, selectedProduct) {
    var productNode = null;
    var products = addNode.getElementsByTagName("Product");
    for (var i = 0; i < products.length; i++) //looping xml childnodes
    {
        var product = products[i];
        var productId = product.getAttribute("ID");

        if (productId == selectedProduct) {
            productNode = product;
        }
    }
    return productNode;
}

function getAddProductCount(xmlDoc) {
    var nodes = xmlDoc.documentElement.getElementsByTagName("Add");
    if (nodes.length > 0) {
        var addNode = xmlDoc.documentElement.getElementsByTagName("Add")[0];

        var products = addNode.getElementsByTagName("Product");
        return products.length;
    }
    return 0;
}

function checkForAddProductNode(xmlDoc, selectedProduct) {
    var addNode = xmlDoc.createElement("Add");
    var nodes = xmlDoc.documentElement.getElementsByTagName("Add");
    if (nodes.length > 0) {
        addNode = xmlDoc.documentElement.getElementsByTagName("Add")[0];
    } else {
        xmlDoc.documentElement.appendChild(addNode);
    }

    var productNode = getProductNode(addNode, selectedProduct);
    return productNode;
}

function checkForRemoveProductNode(xmlDoc, selectedProduct) {
    var removeNode = xmlDoc.createElement("Remove");
    var nodes = xmlDoc.documentElement.getElementsByTagName("Remove");
    if (nodes.length > 0) {
        removeNode = xmlDoc.documentElement.getElementsByTagName("Remove")[0];
    } else {
        xmlDoc.documentElement.appendChild(removeNode);
    }

    var productNode = getProductNode(removeNode, selectedProduct);
    return productNode;
}



function getLanguageNode(productNode, selectedLanguage) {
    var langNode = null;
    var languages = productNode.getElementsByTagName("Language");
    for (var i = 0; i < languages.length; i++) //looping xml childnodes
    {
        var language = languages[i];
        var languageId = language.getAttribute("ID");

        if (languageId == selectedLanguage) {
            langNode = language;
        }
    }
    return langNode;
}

function getLanguageNodeCount(xmlDoc, productId) {
    var addNode = xmlDoc.createElement("Add");

    var nodes = xmlDoc.documentElement.getElementsByTagName("Add");
    if (nodes.length > 0) {
        addNode = xmlDoc.documentElement.getElementsByTagName("Add")[0];

        var productNode = getProductNode(addNode, productId);
        if (productNode) {
            var languages = productNode.getElementsByTagName("Language");
            return languages.length;
        }
    }

    return 0;
}

function getRemoveLanguageNodeCount(xmlDoc, productId) {
    var addNode = xmlDoc.createElement("Remove");

    var nodes = xmlDoc.documentElement.getElementsByTagName("Remove");
    if (nodes.length > 0) {
        addNode = xmlDoc.documentElement.getElementsByTagName("Remove")[0];

        var productNode = getProductNode(addNode, productId);
        if (productNode) {
            var languages = productNode.getElementsByTagName("Language");
            return languages.length;
        }
    }

    return 0;
}


function createXmlDocument(string) {
    var doc;
    if (window.DOMParser) {
        parser = new DOMParser();
        doc = parser.parseFromString(string, "application/xml");
    }
    else // Internet Explorer
    {
        doc = new ActiveXObject("Microsoft.XMLDOM");
        doc.async = "false";
        doc.loadXML(string);
    }
    return doc;
}

function displayXml(xmlDoc) {
    var xmlString = (new XMLSerializer().serializeToString(xmlDoc.documentElement));
    var xmlOutput = vkbeautify.xml(xmlString);
    $('textarea#xmlText').val(xmlOutput);
}

function toggleRemove(sourceId) {

    if (sourceId.toLowerCase() == "removeallproducts") {
        $("#removeSelectProducts").removeClass('active');
        $("#removeSelectProducts").removeClass('btn-primary');

        var $this = $("#removeAllProducts");
        if (!$this.hasClass('active')) {
            $this.addClass('active');
        }

        if (!$this.hasClass('btn-primary')) {
            $this.addClass('btn-primary');
        }

        $("#cbRemoveProduct").prop("disabled", true);
        $("#cbRemoveLanguage").prop("disabled", true);
        $("#btAddRemoveLanguage").prop("disabled", true);
    } else {
        $("#removeAllProducts").removeClass('active');
        $("#removeAllProducts").removeClass('btn-primary');

        var $this = $("#removeSelectProducts");
        if (!$this.hasClass('active')) {
            $this.addClass('active');
        }

        if (!$this.hasClass('btn-primary')) {
            $this.addClass('btn-primary');
        }

        $("#cbRemoveProduct").prop("disabled", false);
        $("#cbRemoveLanguage").prop("disabled", false);
        $("#btAddRemoveLanguage").prop("disabled", false);
    }

}

function toggleUpdatesEnabled(sourceId) {

    if (sourceId.toLowerCase() == "btupdatesenabled") {
        //$("#btupdatesDisabled").removeClass('active');
        $("#btupdatesDisabled").removeClass('btn-primary');

        var $this = $("#btupdatesEnabled");
        //if (!$this.hasClass('active')) {
        //    $this.addClass('active');
        //}

        if (!$this.hasClass('btn-primary')) {
            $this.addClass('btn-primary');
        }

        $("#txtUpdatePath").prop("disabled", false);
        $("#txtTargetVersion").prop("disabled", false);
        $("#txtDeadline").prop("disabled", false);
    } else {
        //$("#btupdatesEnabled").removeClass('active');
        $("#btupdatesEnabled").removeClass('btn-primary');

        var $this = $("#btupdatesDisabled");
        //if (!$this.hasClass('active')) {
        //    $this.addClass('active');
        //}

        if (!$this.hasClass('btn-primary')) {
            $this.addClass('btn-primary');
        }

        $("#txtUpdatePath").prop("disabled", true);
        $("#txtTargetVersion").prop("disabled", true);
        $("#txtDeadline").prop("disabled", true);
    }
    return false;
}

function toggleDisplayLevelEnabled(sourceId) {

    if (sourceId.toLowerCase() == "btlevelnone") {
        $("#btLevelFull").removeClass('active');
        $("#btLevelFull").removeClass('btn-primary');

        var $this = $("#btLevelNone");
        if (!$this.hasClass('active')) {
            $this.addClass('active');
        }

        if (!$this.hasClass('btn-primary')) {
            $this.addClass('btn-primary');
        }
    } else {
        $("#btLevelNone").removeClass('active');
        $("#btLevelNone").removeClass('btn-primary');

        var $this = $("#btLevelFull");
        if (!$this.hasClass('active')) {
            $this.addClass('active');
        }

        if (!$this.hasClass('btn-primary')) {
            $this.addClass('btn-primary');
        }
    }

}

function toggleDisplayEULAEnabled(sourceId) {

    if (sourceId.toLowerCase() == "btaccepteulaenabled") {
        $("#btAcceptEULADisabled").removeClass('active');
        $("#btAcceptEULADisabled").removeClass('btn-primary');

        var $this = $("#btAcceptEULAEnabled");
        if (!$this.hasClass('active')) {
            $this.addClass('active');
        }

        if (!$this.hasClass('btn-primary')) {
            $this.addClass('btn-primary');
        }
    } else {
        $("#btAcceptEULAEnabled").removeClass('active');
        $("#btAcceptEULAEnabled").removeClass('btn-primary');

        var $this = $("#btAcceptEULADisabled");
        if (!$this.hasClass('active')) {
            $this.addClass('active');
        }

        if (!$this.hasClass('btn-primary')) {
            $this.addClass('btn-primary');
        }
    }

}

function toggleLoggingEnabled(sourceId) {

    if (sourceId.toLowerCase() == "btloggingleveloff") {
        $("#btLoggingLevelStandard").removeClass('active');
        $("#btLoggingLevelStandard").removeClass('btn-primary');

        var $this = $("#btLoggingLevelOff");
        if (!$this.hasClass('active')) {
            $this.addClass('active');
        }

        if (!$this.hasClass('btn-primary')) {
            $this.addClass('btn-primary');
        }
    } else {
        $("#btLoggingLevelOff").removeClass('active');
        $("#btLoggingLevelOff").removeClass('btn-primary');

        var $this = $("#btLoggingLevelStandard");
        if (!$this.hasClass('active')) {
            $this.addClass('active');
        }

        if (!$this.hasClass('btn-primary')) {
            $this.addClass('btn-primary');
        }
    }

}


