package c.eip.model

import com.google.gson.annotations.SerializedName

class Offer(
    @SerializedName("id")
    var id: Number? = 0,
    @SerializedName("idUser")
    var idUser: Number? = 0,
    @SerializedName("productImg")
    var productImg: String? = "",
    @SerializedName("productName")
    var productName: String? = "",
    @SerializedName("productSex")
    var productSex: String? = "",
    @SerializedName("productDesc")
    var productDesc: String? = "",
    @SerializedName("productSubject")
    var productSubject: String? = ""
)