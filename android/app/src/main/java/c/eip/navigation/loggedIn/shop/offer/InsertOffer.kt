package c.eip.navigation.loggedIn.shop.offer


import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import c.eip.Constants
import c.eip.R
import c.eip.model.Offer
import c.eip.services.AuthAPI
import com.google.android.material.textfield.TextInputEditText
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class InsertOffer : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_insert_offer, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        view.findViewById<Button>(R.id.saveNewOffer).setOnClickListener {
            val productImg = view.findViewById<TextInputEditText>(R.id.productImg).text.toString()
            val productName = view.findViewById<TextInputEditText>(R.id.productName).text.toString()
            val productDesc = view.findViewById<TextInputEditText>(R.id.productDesc).text.toString()
            val productSex = view.findViewById<TextInputEditText>(R.id.productSex).text.toString()
            val productSubject =
                view.findViewById<TextInputEditText>(R.id.productSubject).text.toString()
            insertNewOffer(productImg, productName, productDesc, productSex, productSubject)
        }
    }

    private fun insertNewOffer(
        productImg: String,
        productName: String,
        productDesc: String,
        productSex: String,
        productSubject: String
    ) {
        val token = dataGetter.getToken(context!!)
        offer.productImg = productImg
        offer.productDesc = productDesc
        offer.productName = productName
        offer.productSex = productSex
        offer.productSubject = productSubject
        val call = offerService.insertNewAdd(token, offer)
        call.enqueue(object : Callback<Offer> {
            override fun onResponse(call: Call<Offer>, response: Response<Offer>) {
                if (response.isSuccessful) {
                    findNavController().navigate(R.id.shop_offer, null)
                    Log.i("Insert Offer", "OK")
                }
            }

            override fun onFailure(call: Call<Offer>, t: Throwable) {
                Log.e("Insert Offer", t.message)
            }

        })
    }

    companion object {
        var offer = Offer()
        var dataGetter = AuthAPI.DataGetter()
        var offerService = Constants.offerServiceTest
    }
}
