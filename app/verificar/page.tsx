"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/navigation/main-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Zap, Link, FileText, Upload, Clock, CheckCircle, AlertCircle, ArrowRight, Copy } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useWallet } from "@/contexts/wallet-context"

export default function VerificarPage() {
  const router = useRouter()
  const { isConnected, address } = useWallet()

  // Form state
  const [inputType, setInputType] = useState<"url" | "text" | "file">("url")
  const [url, setUrl] = useState("")
  const [text, setText] = useState("")
  const [title, setTitle] = useState("")
  const [file, setFile] = useState<File | null>(null)

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      setError("You must connect your wallet to submit a verification")
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSubmitResult(null)

    try {
      let content = ""
      let submitUrl = ""

      if (inputType === "url") {
        submitUrl = url
      } else if (inputType === "text") {
        content = text
      } else if (inputType === "file" && file) {
        content = `File: ${file.name}`
      }

      console.log("[v0] Sending news for validation:", { url: submitUrl, content, title })

      const response = await apiClient.validation.submit({
        url: submitUrl || undefined,
        content: content || undefined,
        title: title || undefined,
      })

      console.log("[v0] Validation response:", response)

      if (response.success && response.data) {
        setSubmitResult(response.data)
      } else {
        throw new Error(response.error?.message || "Error sending the news")
      }
    } catch (error: any) {
      console.error("[v0] Error sending news:", error)
      setError(error.message || "Error sending the news for validation")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    if (inputType === "url") return url.trim().length > 0
    if (inputType === "text") return text.trim().length > 0
    if (inputType === "file") return file !== null
    return false
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const goToTaskDetail = () => {
    if (submitResult?.contentHash) {
      router.push(`/tasks/${submitResult.contentHash}`)
    }
  }

  // Success state
  if (submitResult) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Verification Sent!</CardTitle>
                <CardDescription>
                  Your news has been successfully submitted and is being processed by our multilayer pipeline
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Content Hash */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Content Hash (Task ID)</Label>
                  <div className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                    <code className="flex-1 text-sm font-mono break-all">{submitResult.contentHash}</code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(submitResult.contentHash)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use this hash to track your verification
                  </p>
                </div>

                {/* Transaction Hash */}
                {submitResult.transactionHash && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Transaction Hash</Label>
                    <div className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                      <code className="flex-1 text-sm font-mono break-all">{submitResult.transactionHash}</code>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(submitResult.transactionHash)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Processed Content */}
                {submitResult.processedContent && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Processed Content</Label>
                    <div className="p-4 bg-background rounded-lg border">
                      <h4 className="font-medium mb-2">{submitResult.processedContent.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{submitResult.processedContent.summary}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Processed: {new Date(submitResult.processedContent.timestamp).toLocaleString()}</span>
                        <Badge variant="outline" className="text-xs">
                          {submitResult.processedContent.category || "General"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button onClick={goToTaskDetail} className="w-full" size="lg">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    View Verification Status
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSubmitResult(null)
                      setUrl("")
                      setText("")
                      setTitle("")
                      setFile(null)
                      setError(null)
                    }}
                    className="w-full"
                  >
                    Submit Another News
                  </Button>
                </div>

                {/* Info */}
                <div className="text-center text-sm text-muted-foreground">
                  <p>The verification process can take between 30 minutes and 4 hours</p>
                  <p>You will receive notifications about progress on your dashboard</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Verify News</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Submit any news to verify its truthfulness through our multilayer pipeline
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Main Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Request Verification
              </CardTitle>
              <CardDescription>
                Submit a news article to verify its truthfulness through our multilayer pipeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Wallet Connection Check */}
                {!isConnected && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      You must connect your wallet to submit a verification.
                      <Button variant="link" className="p-0 h-auto ml-1">
                        Connect Wallet
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Input Type Selection */}
                <div className="space-y-3">
                  <Label>Content type</Label>
                  <Tabs value={inputType} onValueChange={(value) => setInputType(value as any)}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="url" className="flex items-center gap-2">
                        <Link className="h-4 w-4" />
                        URL
                      </TabsTrigger>
                      <TabsTrigger value="text" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Text
                      </TabsTrigger>
                      <TabsTrigger value="file" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        File
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="url" className="space-y-3">
                      <Label htmlFor="url">News URL</Label>
                      <Input
                        id="url"
                        type="url"
                        placeholder="https://example.com/news"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter the complete URL of the article or news you want to verify
                      </p>
                    </TabsContent>

                    <TabsContent value="text" className="space-y-3">
                      <Label htmlFor="text">News text</Label>
                      <Textarea
                        id="text"
                        placeholder="Paste here the complete text of the news..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={6}
                      />
                      <p className="text-xs text-muted-foreground">
                        Paste the complete content of the news you want to verify
                      </p>
                    </TabsContent>

                    <TabsContent value="file" className="space-y-3">
                      <Label htmlFor="file">Upload file</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <input
                          id="file"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.txt,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label htmlFor="file" className="cursor-pointer">
                          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm font-medium">{file ? file.name : "Click to upload a file"}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF, image or text document (max. 10MB)
                          </p>
                        </label>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Title (optional) */}
                <div className="space-y-3">
                  <Label htmlFor="title">Title (optional)</Label>
                  <Input
                    id="title"
                    placeholder="News title (auto-generated if not provided)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    If you don't provide a title, it will be automatically generated
                  </p>
                </div>

                <Separator />

                {/* Error Display */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting || !isConnected}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Sending for Verification...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Send for Verification
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* How it Works */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">How does it work?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <h4 className="font-medium">1. AI Analysis</h4>
                  <p className="text-muted-foreground">Multiple oracles analyze the content</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">2. LLM Review</h4>
                  <p className="text-muted-foreground">Coherence and source verification</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">3. Community Validation</h4>
                  <p className="text-muted-foreground">Experts and community vote</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">4. Blockchain Consensus</h4>
                  <p className="text-muted-foreground">Immutable result with ZK proofs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
