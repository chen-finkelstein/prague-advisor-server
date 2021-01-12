var express = require('express')
var router = express.Router();
var DButilsAzure = require('./DButils');
var nodeDT = require('node-datetime');

/**
 * Table PointsOfInterest:
 *      PointID
 *      Name
 *      Description
 *      Category
 *      Views
 *      imagePath
 *      Rank
 */

 /**
 * Table UserPoints:
 *      PointID
 *      Username
 *      DateSaved
 *      PointIndex
 */

 /**
 * Table PointsReviews:
 *      PointID
 *      SubmittedBy
 *      DateSubmitted
 *      Rank
 *      Review
 */

router.get('/', function (req, res) {
    var pointID = req.query.pointID;
    var statement = "select * from PointsOfInterest where PointId=" + pointID + "";
    return DButilsAzure.execQuery(statement).then(function (result) {
        if (result.length > 0) {
            res.status(200).json({ result: result });
        } else {
            res.status(400).send("Point id does not exist");
        }
    }).catch(function (result) {
        res.status(400).send("An error occurred");
    })
});


router.delete('/user', function (req, res) {
    var pointID = req.query.pointID;
    var Username = req.query.Username;
    if (Username == req.decoded.payload.Username) {
        var statement = "delete from UserPoints where PointId=" + pointID + " and Username like '" + Username + "'";
        DButilsAzure.execQuery(statement).then(function (result) {
            res.status(200).send("Done");
        }).catch(function (result) {
            res.status(400).send(result);
        })
    } else {
        res.status(401).send("User does not match token");
    }
});


router.post('/review', function (req, res) {
    var pointID = req.body.pointID; 
    var Username = req.body.Username;
    var review = req.body.review;
    if (Username == req.decoded.payload.Username) {
        var statement = "select * from PointsReviews where SubmittedBy Like '" + Username + "' and PointId = " + pointID + "";
        return DButilsAzure.execQuery(statement).then(function (result) {
            var date = nodeDT.create();
            var formatDate = date.format('Y-m-d H:M:S');
            if (result.length == 0) {
                var statement = "insert into PointsReviews (PointId,SubmittedBy,DateSubmitted,Review) VALUES (" + pointID + ",'" + Username + "','" + formatDate + "','" + review + "')";
                return DButilsAzure.execQuery(statement).then(function (result) {
                    res.status(200).send("Done");
                }).catch(function (result) {
                    res.status(400).send(result);
                })
            } else {
                var statement = "update PointsReviews set DateSubmitted = '" + formatDate + "' ,Review = '" + review + "' where PointId = " + pointID + " and SubmittedBy like '" + Username + "'";
                return DButilsAzure.execQuery(statement).then(function (result) {
                    res.status(200).send("Done");
                }).catch(function (result) {
                    res.status(400).send(result);
                })
            }
        }).catch(function (result) {
            res.status(400).send(result);
        })
    } else {
        res.status(401).send("User does not match token");
    }
});


router.put('/view', function (req, res) {
    var pointID = req.body.pointID;
    var statement = "select * from PointsOfInterest where PointId = " + pointID + "";
    return DButilsAzure.execQuery(statement).then(function (result) {
        if (result.length > 0) {
            var statement2 = "update PointsOfInterest set Views = " + (result[0].Views + 1) + " where PointId = " + pointID + "";
            return DButilsAzure.execQuery(statement2).then(function (result) {
                res.status(200).send("Done");
            }).catch(function (result) {
                res.status(400).send(result);
            })
        } else {
            res.status(400).send("Point id does not exist");
        }
    }).catch(function (result) {
        res.status(400).send(result);
    })
});

router.post('/rank', function (req, res) {
    var id = req.body.pointID; 
    var Username = req.body.Username;
    var rank = req.body.rank;
    if (Username == req.decoded.payload.Username) {
        var statement = "select * from PointsReviews where SubmittedBy Like '" + Username + "' and PointId = " + id + "";
        DButilsAzure.execQuery(statement).then(function (result) {
            var date = nodeDT.create();
            var formatDate = date.format('Y-m-d H:M:S');
            if (result.length == 0) {
                var statement2 = "insert into PointsReviews (PointId,SubmittedBy,DateSubmitted,Rank) VALUES (" + id + ",'" + Username + "','" + formatDate + "'," + rank + ")";
                DButilsAzure.execQuery(statement2).catch(function (result) {
                    res.status(400).send(result);
                })
            } else {
                var statement2 = "update PointsReviews set Rank = " + rank + " where PointId = " + id + " and SubmittedBy like '" + Username + "'";
                DButilsAzure.execQuery(statement2).catch(function (result) {
                    res.status(400).send(result);
                })
            }
            var statement3 = "select * from PointsReviews where PointId = " + id + " and Rank > 0";
            DButilsAzure.execQuery(statement3).then(function (result) {
                var sum = 0;
                for (var i = 0; i < result.length; i++) {
                    sum = sum + result[i].Rank;
                }
                var averageRank = 0;
                if (result.length > 0)
                    averageRank = sum / result.length;
                var statement4 = "UPDATE PointsOfInterest SET Rank = " + averageRank + " WHERE PointId = " + id;
                DButilsAzure.execQuery(statement4).then(function (result) {
                    res.status(200).send("Done");
                }).catch(function (result) {
                    res.status(400).send(result);
                })
            }).catch(function (result) {
                res.status(400).send(result);
            })
        }).catch(function (result) {
            res.status(400).send(result);
        })
    } else {
        res.status(401).send("User does not match token");
    }
});


router.get('/last_two', function (req, res) {
    var Username = req.query.Username;
    if (Username == req.decoded.payload.Username) {
        var statement = "select * from UserPoints where Username like '" + Username + "' ORDER BY DateSaved DESC";
        DButilsAzure.execQuery(statement).then(function (result) {
            points = [];
            if (result.length == 1) {
                points[0] = result[0];
            } else if (result.length > 1){
                points[0] = result[0];
                points[1] = result[1];
            }
            JSON
            res.status(200).json({ result: points });
        }) .catch(function (result) {
            res.status(400).send(result);
        })
    } else {
        res.status(401).send("User does not match token");
    }
});


router.get('/by_date', function (req, res) {
    var Username = req.query.Username;
    if (Username == req.decoded.payload.Username) {
        var statement = "select * from UserPoints where Username like '" + Username + "' ORDER BY DateSaved DESC";
        DButilsAzure.execQuery(statement).then(function (result) {
            if (result.length > 0) {
                res.status(200).json({ result: result });
            } else {
                res.status(200).send("No saved points");  
            }
        }).catch(function (result) {
            res.status(400).send(result);
        })
    } else {
        res.status(401).send("User does not match token");
    }
});


router.post('/save_idx', function (req, res) {
    var id = req.body.pointID;
    var Username = req.body.Username;
    var index = req.body.index;
    if (Username == req.decoded.payload.Username) {
        var statement = "UPDATE UserPoints SET PointIndex = " + index + " WHERE PointId = " + id + " and Username like '" + Username + "'";
        DButilsAzure.execQuery(statement).then(function (result) {
            res.status(200).send("Done");
        }).catch(function (result) {
            res.status(400).send(result);
        })
    } else {
        res.status(401).send("User does not match token");
    }
});


router.get('/last_reviews', function (req, res) {
    var id = req.query.pointID;
    var statement = "select * from PointsReviews where PointId = " + id + " and Review not like '' ORDER BY DateSubmitted DESC";
    DButilsAzure.execQuery(statement).then(function (result) {
        reviews = [];
        if (result.length == 1) {
            reviews[0] = result[0];
        } else if (result.length > 1){
            reviews[0] = result[0];
            reviews[1] = result[1];
        }
        JSON
        res.status(200).json({ result: reviews });
    }).catch(function (result) {
        res.status(400).send(result);
    })
});


router.post('/save', function (req, res) {
    var id = req.body.pointID;
    var Username = req.body.Username;
    if (Username == req.decoded.payload.Username) {
        var statement = "select * from UserPoints where PointId = " + id + " and Username like '" + Username + "'";
        return DButilsAzure.execQuery(statement).then(function (result) {
            var date = nodeDT.create();
            var formatDate = date.format('Y-m-d H:M:S');
            if (result.length == 0) {
                var statement2 = "insert into UserPoints (PointId,Username,DateSaved,PointIndex) VALUES (" + id + ",'" + Username + "','" + formatDate + "'," + "-1" + ")";
                return DButilsAzure.execQuery(statement2).then(function (result) {
                    res.status(200).send("Done");
                }).catch(function (result) {
                    res.status(400).send(result);
                })
            } else {
                res.status(200).send("Point already saved");
            }
        }).catch(function (result) {
            res.status(400).send(result);
        })
    } else {
        res.status(401).send("User does not match token");
    }
});


router.get('/user_order', function (req, res) {
    var Username = req.query.Username;
    if (Username == req.decoded.payload.Username) {
        var statement = "select * from UserPoints where Username like '" + Username + "' order by PointIndex ASC ";
        DButilsAzure.execQuery(statement).then(function (result1) {
            if (result1.length > 0) {
                    res.status(200).json({ result: result1 });
            } else if (result1.length == 0) {
                res.status(200).send("No saved points");
            }
        }).catch(function (result) {
            res.status(400).send(result);
            })
    } else {
        res.status(401).send("User does not match token");
    }
});


router.get('/popular', function (req, res) {
    var statement = "select * from PointsOfInterest where Rank >=3.5";
    DButilsAzure.execQuery(statement).then(function (result) {
        popular = [];
        if (result.length == 1) {
            popular[0] = result[0];
        } else if (result.length == 2){
            popular[0] = result[0];
            popular[1] = result[1];
        } else if (result.length == 3) {
            popular[0] = result[0];
            popular[1] = result[1];
            popular[2] = result[1];
        } else {
            var counter = 0;
            while (counter < 3) {
                var index = Math.floor(Math.random()*result.length);
                if (result[index] != null) {
                    popular[counter] = result[index];
                    result[index] = null;
                    counter++;
                }
            }
        }
        JSON
        res.status(200).json({ result: popular });
    }).catch(function (result) {
        res.status(400).send(result);
    })
});


router.get('/two_popular', function (req, res) {
    var Username = req.query.Username;
    if (Username == req.decoded.payload.Username) {
        var statement = "select Museums,Nature,Food,NightLife from Users where Username ='" + Username + "'";
        DButilsAzure.execQuery(statement).then(function (result) {
            var userCategories = [];
            var popular = [];
            if (result[0].Museums == 1) {
                userCategories[userCategories.length] = "Museums";
            }
            if (result[0].Nature == 1) {
                userCategories[userCategories.length] = "Nature";
            }
            if (result[0].Food == 1) {
                userCategories[userCategories.length] = "Food";
            }
            if (result[0].NightLife == 1) {
                userCategories[userCategories.length] = "NightLife";
            }
            var statement1 = "select * from PointsOfInterest order by Rank DESC";
            DButilsAzure.execQuery(statement1).then(function (result1) {
                if (result1.length > 0) {
                    for (var i = 0; i < result1.length && popular.length < 2; i++) {
                        for (var j = 0; j < userCategories.length && popular.length < 2; j++) {
                            if (result1[i].Category == userCategories[j]){
                                popular[popular.length] = result1[i];
                                userCategories[j] = "used";
                            }
                        }
                    }
                    JSON
                    res.status(200).json({ result: popular });
                } else {
                    JSON
                    res.status(200).send("No points to show");
                }
            }).catch(function (result1) {
                res.status(400).send(result1);
            })
        }).catch(function (result) {
            res.status(400).send(result);
        })
    }
    else {
        res.status(401).send("User does not match token");
    }
});


router.get('/by_category', function (req, res) {
    var category = req.query.Category;
    var statement = "select * from PointsofInterest where Category like '" + category + "'";
    DButilsAzure.execQuery(statement).then(function (result1) {
        if (result1.length > 0) {
            res.status(200).json({ result: result1 });
        } else {
            res.status(200).send("No points in this category");
        }
    }).catch(function (result) {
        res.status(400).send(result);
    })
});


router.get('/by_name', function (req, res) {
    var name = req.query.name;
    var statement = "select * from PointsOfInterest where Name like '" + name + "'";
    DButilsAzure.execQuery(statement).then(function (result1) {
        if (result1.length > 0) {
            res.status(200).json({ result: result1 });
        } else {
            res.status(200).send("No points with this name");
        }
    }).catch(function (result) {
        res.status(400).send(result);
    })
});

module.exports = router;