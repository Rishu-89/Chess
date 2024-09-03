let gamelink = document.querySelector("#gameLink");
let GUrl = window.location.href;
gamelink.innerHTML = GUrl;
gamelink.href = GUrl;

function copyLink() {
    navigator.clipboard.writeText(GUrl).then(() => {
        alert("Link copied to clipboard!");
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}