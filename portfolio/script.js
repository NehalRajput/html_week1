
function data()
{


var user = document.getElementById("name1").value.trim();
var email = document.getElementById("email1").value.trim();
var phone = document.getElementById("phone1").value.trim();
var msg = document.getElementById("msg1").value.trim();

if(user== "" || email== "" || phone==""|| msg=="" )
{
    alert("All fields are mendatory")
    return false;
}
else if(phone.length<10 || phone.length >10)
{
    alert("number shoudle be enter of 10 digit or valid number");
    return false;

}
else if(isNaN(phone)) 
{

    alert("only number should be valid ");
    return false;
}
else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
{ 
    alert("Enter valid Email address");
    return false;

}

else
{
    return true;
}

}


//for notification code here



function sendemail() {
    Email.send({
        Host: "smtp.gmail.com",
        Username: "nehalrajput1710@gmail.com",
        Password: "Nehal1234@#&", // Use an app password
        To: "nehal17.ast@gmail.com",
        From: document.getElementById("email1").value.trim(),
        Subject: "Contact form for enquiry",
        Body: `
            Name: ${document.getElementById("name1").value.trim()}<br>
            Email: ${document.getElementById("email1").value.trim()}<br>
            Phone: ${document.getElementById("phone1").value.trim()}<br>
            Message: ${document.getElementById("msg1").value.trim()}
        `,
    })
        .then(() => {
            alert("Message sent successfully!");
        })
        .catch((error) => {
            console.error("Error sending email:", error);
            alert("Failed to send email. Check the console for more details.");
        });
}
